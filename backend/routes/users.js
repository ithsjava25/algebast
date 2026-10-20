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

// POST /api/users/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "E-postadress och lösenord måste fyllas i",
            });
        }

        const [users] = await pool.execute(`
            SELECT id, username, firstname, lastname, email, password_hash
            FROM users
            WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                error: "Felaktig e-postadress eller lösenord",
            });
        }

        const user = users[0];

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                error: "Felaktig e-postadress eller lösenord",
            });
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
            });
        } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Kunde inte logga in användaren" });
    }
})

module.exports = router;