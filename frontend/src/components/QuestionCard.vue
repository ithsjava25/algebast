<script setup>
import { renderMath } from "../utils/rendermath";

defineProps({
  question: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
  result: { type: Object, default: null },
});

const selected = defineModel();
</script>

<template>
  <article class="question-card card">
    <span class="question-category">
      {{ question.category }}
    </span>

    <h2 class="question-text" v-html="renderMath(question.text)"></h2>

    <div v-if="question.imageUrl" class="question-image-container">
      <img :src="question.imageUrl" alt="Frågebild" class="question-image" />
    </div>

    <div class="answer-options">
      <label
        v-for="option in question.options"
        :key="option.position"
        class="answer-option"
      >
        <input
          v-model="selected"
          type="radio"
          :disabled="disabled"
          :name="`question-${question.id}`"
          :value="option.position"
        />
        <span v-html="renderMath(option.text)"></span>
      </label>
    </div>

    <div
      v-if="result"
      class="result"
      :class="result.isCorrect ? 'correct' : 'wrong'"
      role="status"
    >
      <p v-if="result.isCorrect"><strong>Rätt!</strong></p>
      <template v-else>
        <p><strong>Fel.</strong> Rätt svar: alternativ {{ result.correctPosition }}</p>
        <p
          v-if="result.explanation"
          v-html="renderMath(result.explanation)"
        ></p>
      </template>
    </div>
  </article>
</template>

<style scoped>
.question-category {
  display: inline-block;
  margin-bottom: 12px;
  font-family: "Space Mono", monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.question-text {
  margin: 0 0 24px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text-primary);
}

.question-image-container {
  margin-bottom: 20px;
}

.question-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-diagram);
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--bg-option);
  transition: all 0.2s ease;
}

.answer-option:hover {
  background: var(--bg-muted);
  border-color: var(--accent-color);
}

.answer-option input {
  margin: 0;
  cursor: pointer;
}

.answer-option span {
  line-height: 1.4;
  font-size: 15px;
}

.result {
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: 8px;
  border-left: 4px solid;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
}

.result.correct { 
  background-color: var(--success-bg);
  border-color: var(--success-border);
  color: var(--success-text);
}

.result.wrong { 
  background-color: var(--error-bg);
  border-color: var(--error-border);
  color: var(--error-text);
}

.result p { 
  margin: 0; 
}

.result p + p { 
  margin-top: 8px; 
}
</style>
