<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import QuestionCard from "@/components/QuestionCard.vue";
import { getQuestionsByExam } from "@/services/questionService.js";
import { getExams } from "@/services/examService.js";

const props = defineProps({
  examId: {
    type: String,
    required: true,
  },
});

const examDetails = ref(null);
const questions = ref([]);
const currentIndex = ref(0);
const userAnswers = ref({});

// Håll koll på om sidopanelen är kollapsad eller ej (sätt till true om den ska vara stängd från start)
const isSidebarCollapsed = ref(false);

// Timer: 55 minuter (3300 sekunder)
const timeLeft = ref(55 * 60);
let timerInterval = null;

const formatTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const finishExam = () => {
  if (timerInterval) clearInterval(timerInterval);
  alert("Provet är avslutat!");
};

onMounted(() => {
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      finishExam();
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

watch(
  () => props.examId,
  async (newExamId) => {
    try {
      const allExams = await getExams();
      examDetails.value = allExams.find((e) => String(e.id) === String(newExamId)) || null;
    } catch (error) {
      console.error("Kunde inte hämta provdetaljer:", error);
    }

    questions.value = await getQuestionsByExam(newExamId);
    currentIndex.value = 0;
    userAnswers.value = {};
  },
  { immediate: true }
);

const currentQuestion = computed(() => questions.value[currentIndex.value]);
</script>

<template>
  <div class="exam-view-wrapper">
    <!-- Lägg till klassen 'collapsed' om sidopanelen är stängd -->
    <div class="exam-container" :class="{ 'collapsed': isSidebarCollapsed }">
      
      <!-- Vänster sida: Rubrik, Frågekort och Navigering -->
      <main class="exam-main" v-if="currentQuestion">
        <header class="exam-header">
          <div>
            <h1 v-if="examDetails">
              Högskoleprovet {{ examDetails.semester }} {{ examDetails.year }}
            </h1>
            <h1 v-else>Högskoleprovet</h1>
            <p v-if="examDetails?.session" class="sub-title">
              Provpass {{ examDetails.session }}
            </p>
          </div>

          <div class="header-right">
            <!-- Knapp för att fälla ihop/upp sidopanelen -->
            <button class="toggle-sidebar-btn" @click="isSidebarCollapsed = !isSidebarCollapsed">
              {{ isSidebarCollapsed ? "📊 Visa översikt" : "✕ Dölj översikt" }}
            </button>

            <div class="timer-box" :class="{ warning: timeLeft < 300 }">
              ⏱️ <strong>{{ formatTime }}</strong>
            </div>
          </div>
        </header>

        <div class="question-meta">
          <span>Fråga {{ currentIndex + 1 }} av {{ questions.length }}</span>
        </div>

        <QuestionCard
          :question="currentQuestion"
          v-model="userAnswers[currentQuestion.id]"
        />

        <div class="exam-nav-buttons">
          <button
            @click="currentIndex--"
            :disabled="currentIndex === 0"
            class="nav-btn"
          >
            &larr; Föregående
          </button>

          <button
            @click="currentIndex++"
            :disabled="currentIndex === questions.length - 1"
            class="nav-btn primary"
          >
            Nästa &rarr;
          </button>
        </div>
      </main>

      <!-- Höger sida: Översiktsmeny (Sidopanel) -->
      <aside class="exam-sidebar" v-show="!isSidebarCollapsed">
        <h3>Frågeöversikt</h3>
        <p class="sidebar-sub">Klicka på ett nummer för att navigera.</p>

        <div class="question-grid">
          <button
            v-for="(q, index) in questions"
            :key="q.id"
            class="grid-btn"
            :class="{
              active: index === currentIndex,
              answered: userAnswers[q.id] !== undefined
            }"
            @click="currentIndex = index"
          >
            {{ index + 1 }}
          </button>
        </div>

        <button class="finish-btn" @click="finishExam">
          Avsluta prov
        </button>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.exam-view-wrapper {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 2rem 0;
}

/* Standard: Grid med två kolumner (Huvudinnehåll + 280px sidebar) */
.exam-container {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
  transition: grid-template-columns 0.3s ease;
}

/* När sidopanelen är kollapsad expanderar huvudinnehållet till 100% */
.exam-container.collapsed {
  grid-template-columns: 1fr;
  max-width: 850px; /* Gör läsvyn lite mer centrerad och behaglig */
}

.exam-main {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  border: 1px solid #e2e8f0;
}

.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.exam-header h1 {
  margin: 0;
  font-size: 1.6rem;
  color: #0f172a;
}

.sub-title {
  margin: 0.25rem 0 0 0;
  color: #475569;
  font-size: 1rem;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-sidebar-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.toggle-sidebar-btn:hover {
  background: #e2e8f0;
}

.timer-box {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  white-space: nowrap;
}

.timer-box.warning {
  background: #fff5f5;
  border-color: #feb2b2;
  color: #c53030;
}

.question-meta {
  font-weight: 600;
  color: #334155;
  margin-bottom: 1rem;
}

.exam-nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.nav-btn {
  padding: 0.6rem 1.4rem;
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.nav-btn.primary {
  background: #1e3a8a;
  color: white;
  border-color: #1e3a8a;
}

.nav-btn.primary:hover:not(:disabled) {
  background: #1e40af;
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Sidopanel */
.exam-sidebar {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  height: fit-content;
}

.exam-sidebar h3 {
  margin-top: 0;
  color: #0f172a;
}

.sidebar-sub {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.grid-btn {
  aspect-ratio: 1;
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  color: #334155;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.grid-btn:hover {
  background-color: #f1f5f9;
}

.grid-btn.active {
  border-color: #0284c7;
  background-color: #e0f2fe;
  color: #0369a1;
  box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
}

.grid-btn.answered {
  background-color: #d1e7dd;
  border-color: #a3cfbb;
  color: #0a3622;
}

.finish-btn {
  width: 100%;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.finish-btn:hover {
  background-color: #bb2d3b;
}
</style>