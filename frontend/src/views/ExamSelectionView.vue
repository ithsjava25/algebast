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
  <main>
    <h1>Välj prov</h1>

    <p v-if="loading">Laddar prov...</p>

    <div v-else-if="error" class="error" role="alert">
      <p>{{ error }}</p>
      <button @click="loadExams">Försök igen</button>
    </div>

    <p v-else-if="exams.length === 0">Inga prov hittades.</p>

    <template v-else>
      <ExamCard
        v-for="exam in exams"
        :key="exam.id"
        :exam="exam"
        @start-exam="startExam"
      />
    </template>
  </main>
</template>