<script setup>
import { ref } from "vue";

defineProps({
    question: {
        type: Object,
        required: true,
    },
});

const selectedAnswer = ref(null);

</script>

<template>
  <article class="question-card">
    <span class="question-category">
      {{ question.category }}
    </span>

    <h2 class="question-text">
      {{ question.text }}
    </h2>

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

        <span>{{ option.text }}</span>
      </label>
    </div>
  </article>
</template>