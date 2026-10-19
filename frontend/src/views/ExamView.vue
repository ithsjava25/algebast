<script setup>
import { ref, computed, watch } from "vue";
import QuestionCard from "@/components/QuestionCard.vue";
import {
  getQuestionsByExam,
  turnInAnswers,
} from "@/services/questionService.js";

const props = defineProps({
  examId: {
    type: String,
    required: true,
  },
});

const questions = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedAnswers = ref({}); // { [questionId]: position }
const results = ref(null); // Map-like object: { [questionId]: result }
const submitting = ref(false);
const submitError = ref(null);

const score = computed(() =>
  results.value
    ? Object.values(results.value).filter((r) => r.isCorrect).length
    : 0,
);

const unanswered = computed(
  () =>
    questions.value.filter((q) => selectedAnswers.value[q.id] == null).length,
);

let latestRequestId = 0;

async function loadQuestions() {
  const requestId = ++latestRequestId;
  loading.value = true;
  error.value = null;
  questions.value = [];
  selectedAnswers.value = {}; // reset when the exam changes
  results.value = null;
  submitError.value = null;

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

async function submit() {
  if (unanswered.value > 0) {
    const ok = window.confirm(
      `Du har ${unanswered.value} obesvarade frågor. Vill du lämna in ändå?`,
    );
    if (!ok) return;
  }

  submitting.value = true;
  submitError.value = null;
  try {
    const answers = questions.value.map((q) => ({
      questionId: q.id,
      position: selectedAnswers.value[q.id] ?? null, // unanswered -> null
    }));
    const data = await turnInAnswers(answers);
    results.value = Object.fromEntries(data.map((r) => [r.questionId, r]));
  } catch (err) {
    console.error(err);
    submitError.value = "Kunde inte skicka in svaren. Försök igen.";
  } finally {
    submitting.value = false;
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
        v-model="selectedAnswers[question.id]"
        :question="question"
        :disabled="results !== null || submitting"
        :result="results?.[question.id] ?? null"
      />

      <p v-if="results" role="status">
        Du fick {{ score }} av {{ questions.length }} rätt.
      </p>

      <p v-if="!results && unanswered > 0" class="unanswered" role="status">
        {{
          unanswered === 1
            ? "Du har 1 obesvarad fråga"
            : `Du har ${unanswered} obesvarade frågor`
        }}
      </p>

      <button v-if="!results" :disabled="submitting" @click="submit">
        {{ submitting ? "Skickar in..." : "Lämna in" }}
      </button>

    </template>
  </main>
</template>
