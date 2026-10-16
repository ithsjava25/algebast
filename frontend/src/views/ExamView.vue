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

watch(
  () => props.examId,
  async (newExamId) => {
    questions.value = await getQuestionsByExam(newExamId);
  },
  { immediate: true },
);
</script>

<template>
  <main>
    <h1>Prov</h1>

    <QuestionCard
      v-for="question in questions"
      :key="question.id"
      :question="question"
    />
  </main>
</template>
