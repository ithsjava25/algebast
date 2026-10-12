
const fs = require('fs');
const path = require('path');
const pool = require('../config/connectionMysql');

async function runSchema() {
  try {
    const sqlFilePath = path.join(__dirname, 'schema.sql');
    const sqlQueries = fs.readFileSync(sqlFilePath, 'utf-8');

    console.log('Skapar tabeller i Aiven-databasen...');
    
    await pool.query(sqlQueries);
    
    console.log('Databasen har initierats med tabeller');
  } catch (error) {
    console.error('Kunde inte köra initieringsskriptet:', error);
  } finally {
    await pool.end();
  }
}

runSchema();