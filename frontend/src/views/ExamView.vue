<script setup>
import { ref, watch } from "vue";
import QuestionCard from "@/components/QuestionCard.vue";
import { getQuestionsByExam } from "@/services/questionService.js";

const props = defineProps({
  examId: {
    type: String,
    required: true,
  },
});

const questions = ref([]);
const loading = ref(true);
const error = ref(null);

let latestRequestId = 0;

async function loadQuestions() {
  const requestId = ++latestRequestId;

  loading.value = true;
  error.value = null;
  questions.value = [];

  try {
    const result = await getQuestionsByExam(props.examId);
    if (requestId !== latestRequestId) return; // a newer request exists
    questions.value = result;
  } catch (err) {
    if (requestId !== latestRequestId) return;
    console.error(err);
    error.value = "Kunde inte hämta frågorna just nu. Försök igen om en stund.";
  } finally {
    if (requestId === latestRequestId) loading.value = false;
  }
}

watch(() => props.examId, loadQuestions, { immediate: true });
</script>

<template>
  <main>
    <h1>Prov</h1>

    <p v-if="loading">Laddar frågor...</p>

    <div v-else-if="error" class="error" role="alert">
      <p>{{ error }}</p>
      <button @click="loadQuestions()">Försök igen</button>
    </div>

    <p v-else-if="questions.length === 0">Det här provet har inga frågor.</p>

    <template v-else>
      <QuestionCard
        v-for="question in questions"
        :key="question.id"
        :question="question"
      />
    </template>
  </main>
</template>
