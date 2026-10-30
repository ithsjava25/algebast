<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import QuestionCard from "@/components/QuestionCard.vue";
import { getUserResultDetail } from "@/services/userService.js";

const props = defineProps({
  attemptId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["close"]);

const loading = ref(true);
const error = ref(null);
const detail = ref(null);
const currentIndex = ref(0);
const isSidebarCollapsed = ref(false);

const currentQuestion = computed(() => detail.value?.questions[currentIndex.value]);

const score = computed(() => {
  if (!detail.value) return 0;
  return detail.value.questions.filter(
    (q) => q.chosenPosition === q.correctPosition
  ).length;
});

const resultsMap = computed(() => {
  if (!detail.value) return {};
  const map = {};
  for (const q of detail.value.questions) {
    map[q.id] = {
      isCorrect: q.chosenPosition === q.correctPosition,
      correctPosition: q.correctPosition,
      explanation: q.explanation,
    };
  }
  return map;
});

async function loadDetail() {
  if (!props.attemptId) return;
  loading.value = true;
  error.value = null;
  currentIndex.value = 0;

  try {
    detail.value = await getUserResultDetail(props.attemptId);
  } catch (err) {
    console.error(err);
    error.value = "Kunde inte hämta provdetaljer.";
  } finally {
    loading.value = false;
  }
}

watch(() => props.attemptId, loadDetail, { immediate: true });

// Lås bakgrundens scroll när modalen är öppen
onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="emit('close')">✕</button>

      <div v-if="loading" class="state-container">
        <p>Laddar provdetaljer...</p>
      </div>

      <div v-else-if="error" class="state-container error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="detail" class="review-container" :class="{ collapsed: isSidebarCollapsed }">
        <!-- Huvudvy för frågor -->
        <div class="review-main card">
          <header class="quiz-header">
            <div class="header-left">
              <span class="badge">HP {{ detail.semester }} {{ detail.year }}</span>
              <span class="sub-badge" v-if="detail.session">PASS {{ detail.session }}</span>
            </div>

            <div class="header-right">
              <span class="score-badge">
                Resultat: {{ score }} / {{ detail.questions.length }}
              </span>
              <button
                class="toggle-sidebar-btn"
                @click="isSidebarCollapsed = !isSidebarCollapsed"
              >
                {{ isSidebarCollapsed ? "Visa översikt" : "✕ Dölj översikt" }}
              </button>
            </div>
          </header>

          <div class="question-meta" v-if="currentQuestion">
            <span class="progress-text">
              Fråga {{ currentIndex + 1 }} av {{ detail.questions.length }}
            </span>
          </div>

          <div class="question-card-wrapper">
            <QuestionCard
              v-if="currentQuestion"
              :question="currentQuestion"
              :model-value="currentQuestion.chosenPosition"
              :disabled="true"
              :result="resultsMap[currentQuestion.id]"
            />
          </div>

          <div class="nav-buttons">
            <button
              @click="currentIndex--"
              :disabled="currentIndex === 0"
              class="nav-btn"
            >
              &larr; Föregående
            </button>
            <button
              @click="currentIndex++"
              :disabled="currentIndex === detail.questions.length - 1"
              class="nav-btn primary"
            >
              Nästa &rarr;
            </button>
          </div>
        </div>

        <!-- Sidomeny för översikt -->
        <aside class="review-sidebar card" v-show="!isSidebarCollapsed">
          <h3>Frågeöversikt</h3>
          <div class="question-grid">
            <button
              v-for="(q, index) in detail.questions"
              :key="q.id"
              class="grid-btn"
              :class="{
                active: index === currentIndex,
                correct: q.chosenPosition === q.correctPosition,
                wrong: q.chosenPosition !== q.correctPosition,
              }"
              @click="currentIndex = index"
            >
              {{ index + 1 }}
            </button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 15px;
}

/* Kompaktare och fast höjd för att slippa scrolla på desktop */
.modal-content {
  background: var(--bg-primary, #fff);
  width: 100%;
  max-width: 1050px;
  height: 88vh;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  position: relative;
  padding: 18px 24px;
  box-sizing: border-box;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 14px;
  right: 18px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
  color: var(--text-primary);
}

.review-container {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 16px;
  height: calc(100% - 20px);
  min-height: 0;
  overflow: hidden;
}

.review-container.collapsed {
  grid-template-columns: 1fr;
}

.review-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 16px 20px !important; /* Gör inner-paddingen lite tightare */
}

.review-sidebar {
  height: 100%;
  overflow-y: auto;
  padding: 16px !important;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color, #eee);
  flex-shrink: 0;
}

.question-meta {
  margin-bottom: 8px;
  flex-shrink: 0;
}

/* Låter själva frågekortet scrolla internt om frågan är jättelång, istället för hela modalen */
.question-card-wrapper {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 4px;
}

.score-badge {
  font-weight: 700;
  margin-right: 10px;
  font-size: 13px;
}

.toggle-sidebar-btn {
  background: var(--bg-muted, #f1f3f5);
  border: 1px solid var(--border-color, #ccc);
  color: var(--text-primary, #333);
  padding: 6px 12px;
  border-radius: 8px;
  font-family: "Space Mono", monospace;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-sidebar-btn:hover {
  background: var(--hover-color, #e9ecef);
  border-color: var(--accent-color, #3498db);
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color, #eee);
  flex-shrink: 0;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin-top: 8px;
}

.grid-btn {
  aspect-ratio: 1;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
}

.grid-btn.correct {
  background-color: var(--success-bg, #d4edda);
  color: var(--success-text, #155724);
}

.grid-btn.wrong {
  background-color: var(--error-bg, #f8d7da);
  color: var(--error-text, #721c24);
}

.grid-btn.active {
  box-shadow: 0 0 0 2px var(--accent-color, #3498db);
}
</style>