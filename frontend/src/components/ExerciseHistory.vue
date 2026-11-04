<script setup>
import { renderMath } from "@/utils/rendermath.js";

defineProps({
  history: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <section class="exercise-history">
    <p v-if="history.length === 0">
      Inga besvarade frågor hittades.
    </p>

    <article
      v-for="(answer, index) in history"
      :key="answer.answerId"
      class="history-card card"
    >
      <div class="history-header">
        <h3>Fråga {{ answer.questionId }}</h3>

        <span
          class="answer-status"
          :class="answer.isCorrect ? 'correct' : 'incorrect'"
        >
          {{ answer.isCorrect ? "Rätt" : "Fel" }}
        </span>
      </div>


      <p class="question-text" v-html="renderMath(answer.questionText)">
      </p>

      <img
        v-if="answer.imageUrl"
        :src="answer.imageUrl"
        alt="Bild till frågan"
        class="question-image"
      />

      <div class="answer-details">
        <p>
          <strong>Ditt svar:</strong>
          <span v-html="renderMath(answer.userAnswer ?? 'Inget svar')"></span>
        </p>

        <p>
          <strong>Rätt svar:</strong>
            <span v-html="renderMath(answer.correctAnswer ?? 'Saknas')"></span>
        </p>
      </div>

<!--       <p v-if="answer.explanation" class="explanation">
        <strong>Förklaring:</strong>
        <p v-html="renderMath(answer.explanation)"></p>
      </p> -->

      <time v-if="answer.answeredAt" :datetime="answer.answeredAt">
        Besvarad:
        {{ new Date(answer.answeredAt).toLocaleString("sv-SE") }}
      </time>
    </article>
  </section>
</template>

<style scoped>
.exercise-history {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.history-card {
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.history-header h3 {
  margin: 0;
}

.answer-status {
  padding: 5px 12px;
  border-radius: 6px;
  font-weight: 600;
}

.correct {
  background: #d1fae5;
  color: #065f46;
}

.incorrect {
  background: #fee2e2;
  color: #991b1b;
}

.question-text {
  margin-top: 16px;
}

.question-image {
  max-width: 100%;
  height: auto;
  margin-top: 12px;
}

.answer-details {
  margin-top: 16px;
}

.explanation {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.history-card time {
  display: block;
  margin-top: 16px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>