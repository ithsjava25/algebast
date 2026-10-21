<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import QuestionCard from "@/components/QuestionCard.vue";
import { getQuestionsByExam, turnInAnswers } from "@/services/questionService.js";
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
const loading = ref(true);
const error = ref(null);

const selectedAnswers = ref({}); // { [questionId]: position }
const results = ref(null); // { [questionId]: result }
const submitting = ref(false);
const submitError = ref(null);


const isSidebarCollapsed = ref(false);

// Timer: 55 minuter
const timeLeft = ref(55 * 60);
let timerInterval = null;

const formatTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const score = computed(() =>
  results.value
    ? Object.values(results.value).filter((r) => r.isCorrect).length
    : 0
);

const unanswered = computed(
  () => questions.value.filter((q) => selectedAnswers.value[q.id] == null).length
);

let latestRequestId = 0;

async function loadExamData() {
  const requestId = ++latestRequestId;
  loading.value = true;
  error.value = null;
  questions.value = [];
  selectedAnswers.value = {};
  results.value = null;
  submitting.value = false;
  submitError.value = null;

  try {
    const [allExams, qResult] = await Promise.all([
      getExams().catch(() => []),
      getQuestionsByExam(props.examId)
    ]);

    if (requestId !== latestRequestId) return;

    examDetails.value = allExams.find((e) => String(e.id) === String(props.examId)) || null;
    questions.value = qResult;
    currentIndex.value = 0;
  } catch (err) {
    if (requestId !== latestRequestId) return;
    console.error(err);
    error.value = "Kunde inte hämta frågorna just nu. Försök igen om en stund.";
  } finally {
    if (requestId === latestRequestId) loading.value = false;
  }
}

async function finishExam() {
  if (!results.value && unanswered.value > 0) {
    const ok = window.confirm(
      `Du har ${unanswered.value} obesvarade frågor. Vill du lämna in ändå?`
    );
    if (!ok) return;
  }

  const requestId = latestRequestId;
  submitting.value = true;
  submitError.value = null;

  try {
    const answers = questions.value.map((q) => ({
      questionId: q.id,
      position: selectedAnswers.value[q.id] ?? null,
    }));
    const data = await turnInAnswers(answers);
    if (requestId !== latestRequestId) return;
    results.value = Object.fromEntries(data.map((r) => [r.questionId, r]));
    if (timerInterval) clearInterval(timerInterval);
  } catch (err) {
    if (requestId !== latestRequestId) return;
    console.error(err);
    submitError.value = "Kunde inte skicka in svaren. Försök igen.";
  } finally {
    if (requestId === latestRequestId) submitting.value = false;
  }
}

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

watch(() => props.examId, loadExamData, { immediate: true });

const currentQuestion = computed(() => questions.value[currentIndex.value]);
</script>

<template>
  <div class="exam-view-wrapper">
    <!-- Laddar-tillstånd -->
    <div v-if="loading" class="state-container card">
      <p>Laddar frågor...</p>
    </div>

    <!-- Fel-tillstånd -->
    <div v-else-if="error" class="state-container card error" role="alert">
      <p>{{ error }}</p>
      <button class="nav-btn primary" @click="loadExamData()">Försök igen</button>
    </div>

    <!-- Om inga frågor finns -->
    <div v-else-if="questions.length === 0" class="state-container card">
      <p>Det här provet har inga frågor.</p>
    </div>

    <!-- Huvudlayout när provet är igång -->
    <div v-else class="exam-container" :class="{ 'collapsed': isSidebarCollapsed }">
      
      <!-- Vänster sida: Rubrik, Frågekort och Navigering -->
      <main class="exam-main card">
        
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
              {{ isSidebarCollapsed ? "Visa översikt" : "✕ Dölj översikt" }}
            </button>

            <div class="timer-box" :class="{ warning: timeLeft < 300 }">
              ⏱️ <strong>{{ formatTime }}</strong>
            </div>
          </div>
        </header>

        <!-- Progression-text -->
        <div class="question-meta" v-if="currentQuestion">
          <span class="progress-text">Fråga {{ currentIndex + 1 }} av {{ questions.length }}</span>
        </div>

        <!-- Aktuellt Frågekort -->
        <QuestionCard
          v-if="currentQuestion"
          :question="currentQuestion"
          v-model="selectedAnswers[currentQuestion.id]"
          :disabled="results !== null || submitting"
          :result="results?.[currentQuestion.id] ?? null"
        />

        <!-- Resultat efter inlämning -->
        <div v-if="results" class="score-summary" role="status">
          <h3>Provresultat</h3>
          <p>Du fick <strong>{{ score }}</strong> av <strong>{{ questions.length }}</strong> rätt.</p>
        </div>

        <p v-if="submitError" class="error-msg" role="alert">{{ submitError }}</p>

        <!-- Navigeringsknapparna mellan frågor -->
        <div class="exam-nav-buttons">
          <button
            @click="currentIndex--"
            :disabled="currentIndex === 0"
            class="nav-btn"
          >
            &larr; Föregående
          </button>

          <button
            v-if="currentIndex < questions.length - 1"
            @click="currentIndex++"
            class="nav-btn primary"
          >
            Nästa &rarr;
          </button>

          <button
            v-else-if="!results"
            @click="finishExam"
            :disabled="submitting"
            class="nav-btn primary finish-submit-btn"
          >
            {{ submitting ? "Skickar in..." : "Lämna in prov" }}
          </button>
        </div>
      </main>

      <!-- Höger sida: Översiktsmeny -->
      <aside class="exam-sidebar card" v-show="!isSidebarCollapsed">
        <h3 class="sidebar-title">Frågeöversikt</h3>
        <p class="sidebar-sub">Klicka för att hoppa till fråga.</p>

        <div class="question-grid">
          <button
            v-for="(q, index) in questions"
            :key="q.id"
            class="grid-btn"
            :class="{
              active: index === currentIndex,
              answered: selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== null,
              correct: results?.[q.id]?.isCorrect === true,
              wrong: results?.[q.id]?.isCorrect === false
            }"
            @click="currentIndex = index"
          >
            {{ index + 1 }}
          </button>
        </div>

        <div class="sidebar-footer">
          <p v-if="!results && unanswered > 0" class="unanswered-text">
            {{ unanswered === 1 ? "1 obesvarad fråga" : `${unanswered} obesvarade frågor` }}
          </p>

          <button 
            v-if="!results" 
            class="finish-btn" 
            @click="finishExam"
            :disabled="submitting"
          >
            {{ submitting ? "Skickar in..." : "Lämna in prov" }}
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.exam-view-wrapper {
  padding: 20px 0;
}

.state-container {
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
  padding: 40px;
}

.exam-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 15px;
  transition: grid-template-columns 0.3s ease;
}

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

@media (min-width: 768px) {
  .exam-main {
    padding: 30px;
  }
}

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
  color: #7f8c8d;
  font-weight: 700;
}

.exam-nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 15px;
}

.score-summary {
  margin-top: 24px;
  padding: 16px;
  background: #e8f8f5;
  border: 1px solid #2ecc71;
  border-radius: 8px;
  text-align: center;
}

.score-summary h3 {
  margin: 0 0 6px 0;
  color: #27ae60;
}

.error-msg {
  color: #dc3545;
  font-weight: 700;
  margin-top: 12px;
}

/* Sidopanel */
.exam-sidebar {
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
  color: #7f8c8d;
  margin-bottom: 20px;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 20px;
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
  background-color: #e2e8f0;
  border-color: #94a3b8;
  color: #1e293b;
}

.grid-btn.correct {
  background-color: #d4edda;
  border-color: #28a745;
  color: #155724;
}

.grid-btn.wrong {
  background-color: #f8d7da;
  border-color: #dc3545;
  color: #721c24;
}

.sidebar-footer {
  border-top: 1px solid #f1f2f6;
  padding-top: 15px;
}

.unanswered-text {
  font-size: 13px;
  color: #e67e22;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
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