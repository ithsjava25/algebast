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

// PATCH /api/users/me
router.patch("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const { username, firstname, lastname, email } = req.body;

    const allowedFields = ["username", "firstname", "lastname", "email"];

    const invalidFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        error: "Ogiltiga fält har skickats med",
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Minst ett fält måste anges",
      });
    }

    // Skapa ett tomt objekt för de fält och värden som ska uppdateras
    const updates = {};

    // Validera och lägg till fält i objektet
    if (username !== undefined) {
      if (typeof username !== "string" || username.trim().length < 3) {
        return res.status(400).json({
          error: "Användarnamnet måste innehålla minst 3 tecken",
        });
      }
      updates.username = username.trim();
    }

    if (firstname !== undefined) {
      if (typeof firstname !== "string" || firstname.trim().length === 0) {
        return res.status(400).json({
          error: "Förnamn får inte vara tomt",
        });
      }
      updates.firstname = firstname.trim();
    }

    if (lastname !== undefined) {
      if (typeof lastname !== "string" || lastname.trim().length === 0) {
        return res.status(400).json({
          error: "Efternamn får inte vara tomt",
        });
      }
      updates.lastname = lastname.trim();
    }

    if (email !== undefined) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof email !== "string" || !emailPattern.test(email.trim())) {
        return res.status(400).json({
          error: "Ange en giltig e-postadress",
        });
      }
      updates.email = email.trim();
    }

    // Samla alla fält som ska uppdateras
    const fields = Object.keys(updates);

    // Filtrera ut de fält som måste vara unika i databasen (username och email)
    const uniqueFields = fields.filter((field) =>
      ["username", "email"].includes(field),
    );

    // Skapa SQL-villkor för varje fält som måste vara unikt
    const duplicateConditions = uniqueFields.map((field) => `${field} = ?`);

    // Hämta värdena som ska användas vid kontrollen av unika fält
    const duplicateValues = uniqueFields.map((field) => updates[field]);

    // Slå ihop SQL-villkoren med OR till en enda sträng
    const duplicateQuery = duplicateConditions.join(" OR ");

    // Om det finns fält som måste vara unika, kontrollera om det redan finns användare med samma värden
    if (uniqueFields.length > 0) {
      const [existingUsers] = await pool.execute(
        ` 
          SELECT id
          FROM users
          WHERE id != ?
          AND (${duplicateQuery})
        `,
        [userId, ...duplicateValues],
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({
          error: "Användarnamn eller e-postadress är redan registrerad",
        });
      }
    }

    // Skapa SQL-frågan för att uppdatera användarinformationen
    const updateFields = fields.map((field) => `${field} = ?`);

    // Slå ihop fälten som ska uppdateras till en enda sträng, separerad med kommatecken
    const updateQuery = updateFields.join(", ");

    // Hämta värdena som ska användas vid uppdateringen
    const updateValues = Object.values(updates);

    // Uppdatera användarinformationen i databasen
    await pool.execute(
      `
        UPDATE users
        SET ${updateQuery}
        WHERE id = ?
      `,
      [...updateValues, userId],
    );

    const [users] = await pool.execute(
      `
        SELECT id, username, firstname, lastname, email
        FROM users
        WHERE id = ?
      `,
      [userId],
    );

    res.status(200).json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Ett fel uppstod när användarinformationen skulle uppdateras",
    });
  }
});

// PATCH /api/users/me/password
router.patch("/me/password", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Både nuvarande och nytt lösenord måste fyllas i",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: "Det nya lösenordet måste innehålla minst 8 tecken",
      });
    }

    const [users] = await pool.execute(
      `
        SELECT password_hash
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

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Nuvarande lösenord är felaktigt",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await pool.execute(
      `
        UPDATE users
        SET password_hash = ?
        WHERE id = ?
      `,
      [newPasswordHash, userId],
    );

    res.status(200).json({
      message: "Lösenordet har uppdaterats",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Kunde inte uppdatera lösenordet",
    });
  }
});

// DELETE /api/users/me
router.delete("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const [result] = await pool.execute(
      `
        DELETE FROM users
        WHERE id = ?
      `,
      [userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Användaren kunde inte hittas",
      });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error: "Ett fel uppstod när kontot skulle raderas",
        });
      }

      res.clearCookie("algebast.sid", {
        path: "/",
      });

      res.status(200).json({
        message: "Användaren har tagits bort",
      });
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Ett fel uppstod när kontot skulle raderas",
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

module.exports = router;
