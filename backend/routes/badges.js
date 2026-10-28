const express = require("express");
const pool = require("../config/connectionMySQL");
const router = express.Router();

// Hjälpfunktion som utvärderar vilka badges som är upplåsta
function evaluateBadges(stats) {
  return [
    {
      id: "first_step",
      title: "Första steget",
      description: "Svara på din första fråga",
      unlocked: stats.totalAnswered >= 1,
    },
    {
      id: "getting_started",
      title: "Varm i kläderna",
      description: "Svara på totalt 20 frågor",
      unlocked: stats.totalAnswered >= 20,
    },
    {
      id: "question_machine",
      title: "Frågemaskin",
      description: "Svara på totalt 100 frågor",
      unlocked: stats.totalAnswered >= 100,
    },
    {
      id: "exam_veteran",
      title: "Provad och klar",
      description: "Lämna in ditt första högskoleprov",
      unlocked: stats.completedExams >= 1,
    },
    {
      id: "marathon_runner",
      title: "Maratonlöparen",
      description: "Gör minst 3 kompletta högskoleprov",
      unlocked: stats.completedExams >= 3,
    },
    {
      id: "mathematician",
      title: "Matematikern",
      description: "Svara rätt på minst 30 frågor i XYZ",
      unlocked: stats.xyzCorrect >= 30,
    },
    {
      id: "comparer",
      title: "Jämföraren",
      description: "Svara rätt på minst 30 frågor i KVA",
      unlocked: stats.kvaCorrect >= 30,
    },
    {
      id: "reasoner",
      title: "Resonören",
      description: "Svara rätt på minst 30 frågor i NOG",
      unlocked: stats.nogCorrect >= 30,
    },
    {
      id: "analyst",
      title: "Analytikern",
      description: "Svara rätt på minst 30 frågor i DTK",
      unlocked: stats.dtkCorrect >= 30,
    },
    {
      id: "speedrunner",
      title: "Speedrun",
      description: "Genomför ett provpass på under 45 minuter",
      unlocked: stats.fastestExamSeconds !== null && stats.fastestExamSeconds <= 2700,
    },
    {
      id: "night_owl",
      title: "Nattuggla",
      description: "Svara på frågor eller lämna in prov mellan 00:00 och 04:00",
      unlocked: stats.hasNightActivity,
    },
  ];
}

// GET /api/badges (eller /api/users/me/badges)
router.get("/", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Du är inte inloggad" });
    }

    // 1. Hämta svar-statistik
    const [answerRows] = await pool.execute(
      `
        SELECT 
          COUNT(ua.id) AS totalAnswered,
          SUM(CASE WHEN q.category = 'XYZ' AND ua.selected_position = ao.position THEN 1 ELSE 0 END) AS xyzCorrect,
          SUM(CASE WHEN q.category = 'KVA' AND ua.selected_position = ao.position THEN 1 ELSE 0 END) AS kvaCorrect,
          SUM(CASE WHEN q.category = 'NOG' AND ua.selected_position = ao.position THEN 1 ELSE 0 END) AS nogCorrect,
          SUM(CASE WHEN q.category = 'DTK' AND ua.selected_position = ao.position THEN 1 ELSE 0 END) AS dtkCorrect,
          MAX(CASE WHEN HOUR(ua.answered_at) >= 0 AND HOUR(ua.answered_at) < 4 THEN 1 ELSE 0 END) AS nightAnswer
        FROM user_answers ua
        JOIN question q ON q.id = ua.question_id
        LEFT JOIN answer_option ao ON ao.question_id = q.id AND ao.is_correct = TRUE
        WHERE ua.user_id = ? 
      `,
      [userId]
    );

    // 2. Hämta prov-statistik
    const [examRows] = await pool.execute(
      `
        SELECT 
          COUNT(*) AS completedExams,
          MIN(time_spent_seconds) AS fastestExamSeconds,
          MAX(CASE WHEN HOUR(completed_at) >= 0 AND HOUR(completed_at) < 4 THEN 1 ELSE 0 END) AS nightExam
        FROM user_exam_attempts 
        WHERE user_id = ?
      `,
      [userId]
    );

    const aStats = answerRows[0] || {};
    const eStats = examRows[0] || {};

    const stats = {
      totalAnswered: Number(aStats.totalAnswered || 0),
      xyzCorrect: Number(aStats.xyzCorrect || 0),
      kvaCorrect: Number(aStats.kvaCorrect || 0),
      nogCorrect: Number(aStats.nogCorrect || 0),
      dtkCorrect: Number(aStats.dtkCorrect || 0),
      completedExams: Number(eStats.completedExams || 0),
      fastestExamSeconds: eStats.fastestExamSeconds !== null ? Number(eStats.fastestExamSeconds) : null,
      hasNightActivity: Boolean(aStats.nightAnswer || eStats.nightExam),
    };

    const badges = evaluateBadges(stats);
    res.status(200).json(badges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte hämta användarens badges" });
  }
});

module.exports = router;