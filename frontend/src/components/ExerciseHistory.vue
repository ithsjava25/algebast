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
    <p v-if="history.length === 0">Inga besvarade frågor hittades.</p>

    <details
      v-for="(answer, index) in history"
      :key="answer.answerId"
      class="history-card card"
    >
      <summary class="history-header">
        <h3>Fråga {{ answer.questionId }}</h3>

        <div class="header-actions">
          <span
            class="answer-status"
            :class="answer.isCorrect ? 'correct' : 'incorrect'"
          >
            {{ answer.isCorrect ? "Rätt" : "Fel" }}
          </span>

          <span class="expand-icon" aria-hidden="true">▼</span>
        </div>
      </summary>

      <p class="question-text" v-html="renderMath(answer.questionText)"></p>

      <img
        v-if="answer.imageUrl"
        :src="answer.imageUrl"
        alt="Bild till frågan"
        class="question-image"
      />

      <div class="answer-details">
        <p>
          <strong>Ditt svar:</strong>
          <span
            v-if="answer.selectedAnswer != null || !answer.selectedAnswerImage"
            v-html="renderMath(answer.selectedAnswer ?? 'Inget svar')"
          ></span>
          <img
            v-if="answer.selectedAnswerImage"
            :src="answer.selectedAnswerImage"
            alt="Ditt svar som bild"
            class="question-image"
          />
        </p>

        <p>
          <strong>Rätt svar:</strong>
          <span
            v-if="answer.correctAnswer != null || !answer.correctAnswerImage"
            v-html="renderMath(answer.correctAnswer ?? 'Saknas')"
          ></span>
          <img
            v-if="answer.correctAnswerImage"
            :src="answer.correctAnswerImage"
            alt="Rätt svar som bild"
            class="question-image"
          />
        </p>
      </div>
      <time v-if="answer.answeredAt" :datetime="answer.answeredAt">
        Besvarad:
        {{ new Date(answer.answeredAt).toLocaleString("sv-SE") }}
      </time>
    </details>
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
  padding: 5px 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  list-style: none;
}

.history-header h3 {
  margin: 0;
}

.history-header::-webkit-details-marker {
  display: none;
}

.history-header:hover {
  opacity: 0.85;
}

.history-header:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
  border-radius: 4px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.expand-icon {
  font-size: 0.8rem;
  color: var(--text-secondary);
  transition: transform 0.2s ease;
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

.history-card[open] .expand-icon {
  transform: rotate(180deg);
}

.history-card time {
  display: block;
  margin-top: 16px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>
