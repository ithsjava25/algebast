<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ExamCard from "@/components/ExamCard.vue";
import { getExams } from "@/services/examService.js";

const router = useRouter();
const exams = ref([]);

onMounted(async () => {
  exams.value = await getExams();
});

function startExam(examId) {
  router.push(`/exams/${examId}`);
}
</script>

<template>
  <main>
    <h1>Välj prov</h1>

    <ExamCard
      v-for="exam in exams"
      :key="exam.id"
      :exam="exam"
      @start-exam="startExam"
    />
  </main>
</template>
