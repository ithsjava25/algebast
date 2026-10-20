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
  <main class="exam-selection-view">
    <h1>Välj prov</h1>
    <p class="subtitle">Välj vilket prov du vill köra igång med.</p>

    <div class="exams-container">
      <ExamCard
        v-for="exam in exams"
        :key="exam.id"
        :exam="exam"
        @start-exam="startExam"
      />
    </div>
  </main>
</template>

<style scoped>
.exam-selection-view {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Space Mono', monospace, sans-serif;
  color: #2c3e50;
}

.exam-selection-view h1 {
  font-size: 24px;
  margin-bottom: 8px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 15px;
  margin-bottom: 20px;
}


.exams-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 20px;
}

@media (min-width: 640px) {
  .exams-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
</style>