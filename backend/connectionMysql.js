
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const getSslOptions = () => {
  if (process.env.DB_SSL !== 'true') return undefined;

  if (!process.env.DB_SSL_CA) {
    throw new Error('DB_SSL är aktiverat men DB_SSL_CA är inte definierad i .env');
  }

  const caPath = path.resolve(__dirname, process.env.DB_SSL_CA);
  if (!fs.existsSync(caPath)) {
    throw new Error(`Certifikatfilen för DB_SSL_CA hittades inte på sökvägen: ${caPath}`);
  }

  return {
    rejectUnauthorized: true,
    ca: fs.readFileSync(caPath)
  };
};

// Skapa en pool med anslutningar mot Aiven
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: getSslOptions(),
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
  } finally {
    if (require.main === module) {
     await pool.end();
    }
}
})();

module.exports = pool;
