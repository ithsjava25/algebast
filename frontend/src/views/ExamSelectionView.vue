<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ExamCard from "@/components/ExamCard.vue";
import { getExams } from "@/services/examService.js";

const router = useRouter();
const exams = ref([]);
const loading = ref(true);
const error = ref(null);

async function loadExams() {
  loading.value = true;
  error.value = null;

  try {
    exams.value = await getExams();
  } catch (err) {
    console.error(err);
    error.value = "Kunde inte hämta proven just nu. Försök igen om en stund.";
  } finally {
    loading.value = false;
  }
}

function startExam(examId) {
  router.push(`/exams/${examId}`);
}

onMounted(loadExams);
</script>

<template>
  <div class="exam-selection-view">
    <h1>Prov</h1>
    <p class="subtitle">Välj ett provpass för att starta.</p>

    <!-- Laddar-tillstånd -->
    <p v-if="loading" class="state-msg">Laddar prov...</p>

    <!-- Fel-tillstånd -->
    <div v-else-if="error" class="error-box" role="alert">
      <p>{{ error }}</p>
      <button class="nav-btn primary" @click="loadExams">Försök igen</button>
    </div>

    <!-- Om inga prov hittades -->
    <p v-else-if="exams.length === 0" class="state-msg">Inga prov hittades.</p>

    <!-- Provlista med din snygga grid-layout -->
    <div v-else class="exams-container">
      <ExamCard
        v-for="exam in exams"
        :key="exam.id"
        :exam="exam"
        @start-exam="startExam"
      />
    </div>
  </div>
</template>

<style scoped>
.exam-selection-view {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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
