const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/connectionMySQL");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const { username, firstname, lastname, email, password } = req.body;

    const trimmedUsername = username?.trim();
    const trimmedFirstname = firstname?.trim();
    const trimmedLastname = lastname?.trim();
    const trimmedEmail = email?.trim();

    if (
      !trimmedUsername ||
      !trimmedFirstname ||
      !trimmedLastname ||
      !trimmedEmail ||
      !password
    ) {
      return res.status(400).json({
        error: "Alla fält måste fyllas i",
      });
    }

    if (trimmedUsername.length < 3) {
      return res.status(400).json({
        error: "Användarnamnet måste innehålla minst 3 tecken",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      return res.status(400).json({
        error: "Ange en giltig e-postadress",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Lösenordet måste innehålla minst 8 tecken",
      });
    }

    const [existingUsers] = await pool.execute(
      `
            SELECT id
            FROM users
            WHERE username = ? OR email = ?`,
      [trimmedUsername, trimmedEmail],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: "Användarnamn eller e-postadress är redan registrerad",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `
            INSERT INTO users
            (username, firstname, lastname, email, password_hash)
            VALUES (?, ?, ?, ?, ?)`,
      [
        trimmedUsername,
        trimmedFirstname,
        trimmedLastname,
        trimmedEmail,
        passwordHash,
      ],
    );

    res.status(201).json({
      id: result.insertId,
      username: trimmedUsername,
      firstname: trimmedFirstname,
      lastname: trimmedLastname,
      email: trimmedEmail,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte registrera användaren" });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "E-postadress och lösenord måste fyllas i",
      });
    }

    const [users] = await pool.execute(
      `
            SELECT id, username, firstname, lastname, email, password_hash
            FROM users
            WHERE email = ?`,
      [email],
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: "Felaktig e-postadress eller lösenord",
      });
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Felaktig e-postadress eller lösenord",
      });
    }

    const pending = req.session.pendingExam;

    req.session.regenerate((err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Kunde inte logga in användaren" });
      }

      req.session.userId = user.id;
      if (pending) req.session.pendingExam = pending;

      req.session.save((err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Kunde inte logga in användaren" });
        }

        res.status(200).json({
          id: user.id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte logga in användaren" });
  }
});

// GET /api/users/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const [users] = await pool.execute(
      `
        SELECT id, username, firstname, lastname, email
        FROM users
        WHERE id = ?
      `,
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: "Användaren kunde inte hittas",
      });
    }

    res.status(200).json(users[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Ett fel uppstod när användarinformationen skulle hämtas",
    });
  }
});

// GET /api/users/me/results
router.get("/me/results", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const [results] = await pool.execute(
      `
        SELECT
          uea.id AS attemptId,
          uea.exam_id AS examId,
          e.year,
          e.semester,
          e.session,
          uea.time_spent_seconds AS timeSpentSeconds,
          uea.completed_at AS completedAt,
          COUNT(DISTINCT q.id) AS totalQuestions,
          COUNT(DISTINCT CASE
            WHEN ua.selected_position = ao.position
            THEN q.id
          END) AS correctAnswers
        FROM user_exam_attempts uea
        JOIN exam e
          ON e.id = uea.exam_id
        LEFT JOIN question q
          ON q.exam_id = e.id
        LEFT JOIN user_answers ua
          ON ua.attempt_id = uea.id
          AND ua.question_id = q.id
          AND ua.user_id = uea.user_id
        LEFT JOIN answer_option ao
          ON ao.question_id = q.id
          AND ao.is_correct = TRUE
        WHERE uea.user_id = ?
        GROUP BY
          uea.id,
          uea.exam_id,
          e.year,
          e.semester,
          e.session,
          uea.time_spent_seconds,
          uea.completed_at
        ORDER BY uea.completed_at DESC, uea.id DESC
      `,
      [userId],
    );

    res.status(200).json(results);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Kunde inte hämta provhistoriken",
    });
  }
});

// GET /api/users/me/exercise-stats
router.get("/me/exercise-stats", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const [results] = await pool.execute(
      `
        SELECT
          q.category,
          COUNT(ua.selected_position) AS answered,
          SUM(
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM answer_option ao
                WHERE ao.question_id = ua.question_id
                  AND ao.position = ua.selected_position
                  AND ao.is_correct = TRUE
                )
                  THEN 1
                  ELSE 0
                END
              ) AS correct
            FROM user_answers ua
            JOIN question q
              ON q.id = ua.question_id
            WHERE ua.user_id = ?
              AND ua.attempt_id IS NULL
            GROUP BY q.category
            `,
      [userId],
    );
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Kunde inte hämta statistik för övningsfrågor",
    });
  }
});

// POST /api/users/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Ett fel uppstod, försök igen",
      });
    }

    res.clearCookie("algebast.sid", {
      path: "/",
    });

    res.status(200).json({
      message: "Användaren har loggat ut",
    });
  });
});

// GET /api/users/me/results/:attemptId
router.get("/me/results/:attemptId", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const attemptId = Number(req.params.attemptId);

    if (!Number.isInteger(attemptId) || attemptId <= 0) {
      return res.status(400).json({ error: "Ogiltigt försök-ID" });
    }

    // Hämta provförsöket och kontrollera att det tillhör användaren
    const [attempts] = await pool.execute(
      `SELECT uea.id, uea.exam_id, uea.time_spent_seconds, uea.completed_at,
              e.year, e.semester, e.session
       FROM user_exam_attempts uea
       JOIN exam e ON e.id = uea.exam_id
       WHERE uea.id = ? AND uea.user_id = ?`,
      [attemptId, userId]
    );

    if (attempts.length === 0) {
      return res.status(404).json({ error: "Provförsök kunde inte hittas" });
    }

    const attempt = attempts[0];

    // Hämta alla frågor för provet tillsammans med facit och användarens val
    const [questions] = await pool.execute(
      `SELECT q.id, q.question_order, q.category, q.question_text, q.image_url, q.explanation,
              ao.position AS correct_position,
              ua.selected_position AS chosen_position
       FROM question q
       JOIN answer_option ao ON ao.question_id = q.id AND ao.is_correct = TRUE
       LEFT JOIN user_answers ua ON ua.question_id = q.id AND ua.attempt_id = ? AND ua.user_id = ?
       WHERE q.exam_id = ?
       ORDER BY q.question_order`,
      [attemptId, userId, attempt.exam_id]
    );

    // Hämta alla svarsalternativ
    const [options] = await pool.execute(
      `SELECT ao.question_id, ao.position, ao.option_text, ao.option_image_url
       FROM answer_option ao
       JOIN question q ON q.id = ao.question_id
       WHERE q.exam_id = ?
       ORDER BY ao.question_id, ao.position`,
      [attempt.exam_id]
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

    res.json({
      attemptId: attempt.id,
      examId: attempt.exam_id,
      year: attempt.year,
      semester: attempt.semester,
      session: attempt.session,
      timeSpentSeconds: attempt.time_spent_seconds,
      completedAt: attempt.completed_at,
      questions: questions.map((q) => ({
        id: q.id,
        order: q.question_order,
        category: q.category,
        text: q.question_text,
        imageUrl: q.image_url,
        explanation: q.explanation,
        correctPosition: q.correct_position,
        chosenPosition: q.chosen_position,
        options: byQuestion.get(q.id) ?? [],
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte hämta provdetaljer" });
  }
});

module.exports = router;
