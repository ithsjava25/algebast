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

// Håll koll på om sidopanelen är kollapsad eller ej
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
    <div class="exam-container" :class="{ 'collapsed': isSidebarCollapsed }">
      
      <!-- Vänster sida: Rubrik, Frågekort och Navigering -->
      <main class="exam-main" v-if="currentQuestion">
        
        <!-- Övre info-bar liknande Quiz.vue -->
        <header class="quiz-header">
          <div class="header-left">
            <span class="badge" v-if="examDetails">
              HP {{ examDetails.semester }} {{ examDetails.year }}
            </span>
            <span class="badge" v-else>Högskoleprovet</span>
            
            <span class="sub-badge" v-if="examDetails?.session">
              PASS {{ examDetails.session }}
            </span>
          </div>

          <div class="header-right">
            <button class="toggle-sidebar-btn" @click="isSidebarCollapsed = !isSidebarCollapsed">
              {{ isSidebarCollapsed ? "📊 Visa översikt" : "✕ Dölj översikt" }}
            </button>

            <div class="timer-box" :class="{ warning: timeLeft < 300 }">
              ⏱️ <strong>{{ formatTime }}</strong>
            </div>
          </div>
        </header>

        <!-- Progress-text -->
        <div class="question-meta">
          <span class="progress-text">Fråga {{ currentIndex + 1 }} av {{ questions.length }}</span>
        </div>

        <!-- Frågekortet -->
        <QuestionCard
          :question="currentQuestion"
          v-model="userAnswers[currentQuestion.id]"
        />

        <!-- Navigeringsknappar -->
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

      <!-- Höger sida: Översiktsmeny -->
      <aside class="exam-sidebar" v-show="!isSidebarCollapsed">
        <h3 class="sidebar-title">Frågeöversikt</h3>
        <p class="sidebar-sub">Klicka för att hoppa till fråga.</p>

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
  padding: 20px 0; /* Optimerat för mindre skärmar */
  font-family: 'Space Mono', monospace, sans-serif;
  color: #2c3e50;
}

/* Mobile-first: Standard är 1 kolumn */
.exam-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 15px;
  transition: grid-template-columns 0.3s ease;
}

/* På större skärmar (desktop) aktiveras sidopanelen i ett grid med 2 kolumner */
@media (min-width: 768px) {
  .exam-view-wrapper {
    padding: 40px 0;
  }
  
  .exam-container {
    grid-template-columns: 1fr 280px;
    max-width: 1100px;
    padding: 0 20px;
  }

  .exam-container.collapsed {
    grid-template-columns: 1fr;
    max-width: 800px;
  }
}

/* Huvudkort */
.exam-main {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 20px; /* Lite tightare på mobil */
  border: 1px solid #eef2f3;
}

@media (min-width: 768px) {
  .exam-main {
    padding: 30px;
  }
}

/* Header & Element */
.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #f8f9fa;
  padding-bottom: 15px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-sidebar-btn {
  background: #f1f2f6;
  border: 1px solid #dcdde1;
  color: #2c3e50;
  padding: 8px 14px;
  border-radius: 8px;
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-sidebar-btn:hover {
  background: #e4e6eb;
  border-color: #3498db;
}

.timer-box {
  background: #f8f9fa;
  border: 1px solid #dcdde1;
  color: #2c3e50;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
}

.timer-box.warning {
  background: #fff9f9;
  border-color: #dc3545;
  color: #dc3545;
}

.question-meta {
  margin-bottom: 20px;
}

.progress-text {
  font-size: 14px;
  color: #95a5a6;
  font-weight: 700;
}

.exam-nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 15px;
}

/* Sidopanel */
.exam-sidebar {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eef2f3;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
}

.sidebar-title {
  margin-top: 0;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 700;
}

.sidebar-sub {
  font-size: 12px;
  color: #95a5a6;
  margin-bottom: 20px;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 24px;
}

.grid-btn {
  aspect-ratio: 1;
  border: 1px solid #dcdde1;
  background-color: #f1f2f6;
  color: #2c3e50;
  border-radius: 8px;
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.grid-btn:hover {
  background-color: #e4e6eb;
  border-color: #3498db;
}

.grid-btn.active {
  border-color: #3498db;
  background-color: #ebf3f9;
  color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.grid-btn.answered {
  background-color: #d4edda;
  border-color: #28a745;
  color: #155724;
}

.finish-btn {
  width: 100%;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.finish-btn:hover {
  background-color: #c82333;
}
</style>