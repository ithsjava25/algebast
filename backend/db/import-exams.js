const fs = require('fs');
const path = require('path');
const pool = require('../config/connectionMysql'); 

async function importExamFiles() {
  const jsonDir = path.join(__dirname, 'data', 'exams'); 
  const files = fs.readdirSync(jsonDir).filter(file => file.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(jsonDir, file);
    const examData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Spara prov
      const { year, semester, session } = examData.exam;
      const [examResult] = await connection.execute(
        `INSERT INTO exam (year, semester, session) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
        [year, semester, session]
      );
      
      let examId = examResult.insertId;
      if (!examId) {
        const [existing] = await connection.execute(
          `SELECT id FROM exam WHERE year = ? AND semester = ? AND session = ?`,
          [year, semester, session]
        );
        examId = existing[0].id;
      }

      // Spara frågor och alternativ...
      for (const q of examData.questions) {
        const [questResult] = await connection.execute(
          `INSERT INTO question (exam_id, question_order, category, question_text, image_url, explanation) 
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE question_text = VALUES(question_text)`,
          [examId, q.question_order, q.category, q.question_text, q.image_url, q.explanation]
        );

        let questionId = questResult.insertId;
        if (!questionId) {
          const [existingQ] = await connection.execute(
            `SELECT id FROM question WHERE exam_id = ? AND question_order = ?`,
            [examId, q.question_order]
          );
          questionId = existingQ[0].id;
        }

        for (const opt of q.options) {
          await connection.execute(
            `INSERT INTO answer_option (question_id, position, option_text, option_image_url, is_correct) 
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE option_text = VALUES(option_text), is_correct = VALUES(is_correct)`,
            [questionId, opt.position, opt.option_text, opt.option_image_url, opt.is_correct]
          );
        }
      }

      await connection.commit();
      console.log(`Importerat: ${file}`);
    } catch (err) {
      await connection.rollback();
      console.error(`Fel vid import av ${file}:`, err);
    } finally {
      connection.release();
    }
  }
}

importExamFiles();