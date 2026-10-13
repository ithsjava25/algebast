const express = require("express");
const pool = require("../db"); // Import the database connection pool (placeholder)
const router = express.Router();

// GET /api/exams
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, year, semester, session
      FROM exam
      ORDER BY year DESC, semester DESC, session DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch exams" });
  }
});

// GET /api/exams/:id/questions
router.get("/:id/questions", async (req, res) => {
  try {
    const examId = Number(req.params.id);
    if (!Number.isInteger(examId)) {
      return res.status(400).json({ error: "Invalid exam id" });
    }

    const [questions] = await pool.execute(
      `SELECT id, question_order, category, question_text, image_url
       FROM question
       WHERE exam_id = ?
       ORDER BY question_order`,
      [examId],
    );
    if (questions.length === 0) {
      return res
        .status(404)
        .json({ error: "Exam not found or has no questions" });
    }

    const [options] = await pool.execute(
      `SELECT ao.question_id, ao.position, ao.option_text, ao.option_image_url
       FROM answer_option ao
       JOIN question q ON q.id = ao.question_id
       WHERE q.exam_id = ?
       ORDER BY ao.question_id, ao.position`,
      [examId],
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
        order: q.question_order,
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

module.exports = router;
