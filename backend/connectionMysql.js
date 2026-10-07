
const mysql = require('mysql2/promise');
require('dotenv').config();

// Skapa en pool med anslutningar mot Aiven
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? {
    // Krävs för att Aivens SSL-kryptering ska fungera sömlöst i Node.js
    rejectUnauthorized: false
  } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kontroll av anslutningen vid serverstart
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Ansluten till Aiven MySQL-databasen!');
    connection.release();
  } catch (error) {
    console.error('Kunde inte ansluta till Aiven-databasen:', error.message);
  }
})();

module.exports = pool;