const  express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/connectionMySQL");
const router = express.Router();

// POST /api/users/register
router.post("/register", async (req, res) => {
    try {
        const { username, firstname, lastname, email, password } = req.body;

        if (!username || !firstname || !lastname || !email || !password) {
            return res.status(400).json({
                error: "Alla fält måste fyllas i",
            });
        }

        const [existingUsers] = await pool.execute(`
            SELECT id
            FROM users
            WHERE username = ? OR email = ?`,
        [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                error: "Användarnamn eller e-postadress är redan registrerad",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(`
            INSERT INTO users
            (username, firstname, lastname, email, password_hash)
            VALUES (?, ?, ?, ?, ?)`,
        [username, firstname, lastname, email, passwordHash]
        );

        res.status(201).json({
            id: result.insertId,
            username,
            firstname,
            lastname,
            email,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Kunde inte registrera användaren" });
    }
});


module.exports = router;