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
      return res.status(400).json({ error: `count must be an integer from 1 to ${MAX_COUNT}` });
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

module.exports = router;
