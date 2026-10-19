<script setup>
import { computed } from "vue";
import { renderMath } from "../utils/rendermath";

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: [Number, String],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectedAnswer = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <article class="question-card">
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
          v-model="selectedAnswer"
          type="radio"
          :name="`question-${question.id}`"
          :value="option.position"
        />

        <span v-html="renderMath(option.text)"></span>
      </label>
    </div>
  </article>
</template>

<style scoped>
.question-card {
  width: 100%;
  padding: 24px;
  border: 1px solid #aaa;
  background: #fff;
}

.question-category {
  display: inline-block;
  margin-bottom: 12px;
  font-family: "Space Mono", monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #666;
}

.question-text {
  margin: 0 0 24px;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5;
}

.question-image-container {
  margin-bottom: 20px;
}

.question-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.answer-option:hover {
  background: #f3f3f1;
  border-color: #888;
}

.answer-option input {
  margin: 0;
  cursor: pointer;
}

.answer-option span {
  line-height: 1.4;
}
</style>