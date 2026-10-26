const express = require("express");
const pool = require("../config/connectionMySQL");
const router = express.Router();

const CATEGORIES = ["XYZ", "KVA", "NOG", "DTK"];
const MAX_COUNT = 120;

// GET /api/questions?categories=KVA,NOG&count=10
router.get("/", async (req, res) => {
  try {
    const requested = String(req.query.categories ?? "")
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);
    const categories = requested.length ? [...new Set(requested)] : CATEGORIES;

    if (!categories.every((c) => CATEGORIES.includes(c))) {
      return res.status(400).json({
        error: `categories must be a comma-separated list of: ${CATEGORIES.join(", ")}`,
      });
    }

    const count = Number(req.query.count ?? 10);
    if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) {
      return res
        .status(400)
        .json({ error: `count must be an integer from 1 to ${MAX_COUNT}` });
    }

    const [questions] = await pool.query(
      `SELECT id, exam_id, question_order, category, question_text, image_url
       FROM question
       WHERE category IN (?)
       ORDER BY RAND()
       LIMIT ?`,
      [categories, count],
    );

    if (questions.length === 0) {
      return res.json([]);
    }

    const [options] = await pool.query(
      `SELECT question_id, position, option_text, option_image_url
       FROM answer_option
       WHERE question_id IN (?)
       ORDER BY question_id, position`,
      [questions.map((q) => q.id)],
    );

    const byQuestion = new Map();
    for (const o of options) {
      if (!byQuestion.has(o.question_id)) byQuestion.set(o.question_id, []);
      byQuestion.get(o.question_id).push({
        position: o.position,
        text: o.option_text,
        imageUrl: o.option_image_url,
      });
    }

    res.json(
      questions.map((q) => ({
        id: q.id,
        examId: q.exam_id,
        category: q.category,
        text: q.question_text,
        imageUrl: q.image_url,
        options: byQuestion.get(q.id) ?? [],
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch questions" });
  }
});

// POST /api/questions/check
// practice:  { "answers": [ { "questionId": 101, "position": 3 } ] }
// full exam: { "examId": 4, "answers": [ ... ], "timeSpentSeconds": 4210 }
router.post("/check", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const userId = req.session?.userId ?? null; // null = guest
    const { examId, answers, timeSpentSeconds = null } = req.body ?? {};
    const isExam = examId !== undefined;

    const valid =
      (!isExam || Number.isInteger(examId)) &&
      Array.isArray(answers) &&
      answers.length <= 200 &&
      (isExam || answers.length > 0) &&
      answers.every(
        (a) =>
          Number.isInteger(a?.questionId) &&
          (a.position === null ||
            (Number.isInteger(a.position) &&
              a.position >= 1 &&
              a.position <= 5)),
      ) &&
      (timeSpentSeconds === null ||
        (Number.isInteger(timeSpentSeconds) &&
          timeSpentSeconds >= 0 &&
          timeSpentSeconds <= 86400));
    if (!valid) {
      return res.status(400).json({ error: "Invalid examId, answers or time" });
    }

    const chosenById = new Map(answers.map((a) => [a.questionId, a.position]));

    const [rows] = await conn.query(
      `SELECT q.id AS question_id, q.question_order, q.explanation,
              ao.position AS correct_position
       FROM question q
       JOIN answer_option ao ON ao.question_id = q.id AND ao.is_correct = TRUE
       WHERE ${isExam ? "q.exam_id = ?" : "q.id IN (?)"}
       ORDER BY q.exam_id, q.question_order`,
      [isExam ? examId : [...chosenById.keys()]],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: isExam ? "Exam not found" : "No questions found" });
    }

    let score = 0;
    const results = rows.map((q) => {
      const chosen = chosenById.get(q.question_id) ?? null; // skipped -> null
      const isCorrect = chosen === q.correct_position;
      if (isCorrect) score++;
      return {
        questionId: q.question_id,
        chosen,
        isCorrect,
        ...(isExam || !isCorrect
          ? { correctPosition: q.correct_position, explanation: q.explanation }
          : {}),
      };
    });

    // Save only for logged-in users
    let attemptId = null;
    if (userId) {
      await conn.beginTransaction();
      if (isExam) {
        const [attempt] = await conn.query(
          `INSERT INTO user_exam_attempts (user_id, exam_id, time_spent_seconds, completed_at)
           VALUES (?, ?, ?, NOW())`,
          [userId, examId, timeSpentSeconds],
        );
        attemptId = attempt.insertId;
      }
      await conn.query(
        "INSERT INTO user_answers (user_id, attempt_id, question_id, selected_position) VALUES ?",
        [results.map((r) => [userId, attemptId, r.questionId, r.chosen])],
      );
      await conn.commit();
    }

    res.status(isExam && userId ? 201 : 200).json({
      attemptId,
      saved: Boolean(userId),
      score,
      total: results.length,
      results,
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Could not check answers" });
  } finally {
    conn.release();
  }
});

module.exports = router;
