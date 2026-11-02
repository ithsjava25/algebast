const pool = require("../config/connectionMySQL");

async function requireAuth(req, res, next) {
  const userId = req.session?.userId;

  if (!userId) {
    return res.status(401).json({
      error: "Du är inte inloggad",
    });
  }

  try {
    const [users] = await pool.execute(
      `
        SELECT id
        FROM users
        WHERE id = ?
      `,
      [userId],
    );

    if (users.length === 0) {
      // Användaren är borttagen, så sessionen är inte längre giltig
      return req.session.destroy(() => {
        res.clearCookie("algebast.sid", {
          path: "/",
        });

        res.status(401).json({
          error: "Du är inte inloggad",
        });
      });
    }

    next();
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Ett fel uppstod, försök igen",
    });
  }
}

module.exports = requireAuth;
