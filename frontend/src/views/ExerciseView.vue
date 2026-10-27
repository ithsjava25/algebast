<script setup>
import { ref, computed } from "vue";
import { getRandomQuestionsByCategories, turnInAnswers } from "@/services/questionService.js";
import QuestionCard from "@/components/QuestionCard.vue";
import { renderMath } from "@/utils/rendermath";


const categories = [
  { code: "XYZ", name: "Matematik" },
  { code: "KVA", name: "Kvantitativa jämförelser" },
  { code: "NOG", name: "Kvantitativa resonemang" },
  { code: "DTK", name: "Diagram, tabeller och kartor" },
];

const selectedCategories = ref([]); 
const questions = ref([]);          
const currentIndex = ref(0);        


const selectedPosition = ref(null); 
const feedback = ref(null);         
const isLoadingMore = ref(false);   

const correctCount = ref(0);        // Håller koll på antal rätta svar
const answeredCount = ref(0);      // Håller koll på hur många frågor vi svarat på
const showSummaryModal = ref(false); // Styr om modalen för sammanfattning är öppen

// Hämtar fram den aktuella frågan baserat på currentIndex
const currentQuestion = computed(() => questions.value[currentIndex.value] || null);

const totalAnswered = computed(() => {
  return currentIndex.value + (feedback.value !== null ? 1 : 0);
});


function selectCategory(code) {
  if (selectedCategories.value.includes(code)) {
    selectedCategories.value = selectedCategories.value.filter((c) => c !== code);
  } else {
    selectedCategories.value.push(code);
  }
}

// hämtar en första batch på 20 frågor
async function startExercise() {
  try {
    currentIndex.value = 0;
    feedback.value = null;
    selectedPosition.value = null;
    correctCount.value = 0;
    answeredCount.value = 0;
    showSummaryModal.value = false;
    questions.value = await getRandomQuestionsByCategories(selectedCategories.value, 20);
  } catch (err) {
    console.error("Kunde inte starta övning:", err);
  }
}

// Hämtar fler frågor i bakgrunden
async function fetchMoreQuestions() {
  if (isLoadingMore.value) return;
  try {
    isLoadingMore.value = true;
    const moreQuestions = await getRandomQuestionsByCategories(selectedCategories.value, 20);
    questions.value.push(...moreQuestions);
  } catch (err) {
    console.error("Kunde inte ladda fler frågor:", err);
  } finally {
    isLoadingMore.value = false;
  }
}

// För direkt feedback
async function handleSelectAnswer(position) {
  if (feedback.value !== null || !currentQuestion.value) return;

  selectedPosition.value = position;

  try {
    const result = await turnInAnswers([
      { questionId: currentQuestion.value.id, position: position }
    ]);
    
    if (result && result.length > 0) {
      feedback.value = result[0];
      
      answeredCount.value++;
      if (feedback.value.isCorrect) {
        correctCount.value++;
      }
    }
  } catch (err) {
    console.error("Kunde inte rätta svar:", err);
  }
}

// Går vidare till nästa fråga
async function nextQuestion() {
  feedback.value = null;
  selectedPosition.value = null;
  currentIndex.value++;

  if (currentIndex.value >= questions.value.length - 3) {
    await fetchMoreQuestions();
  }
}

// Hämtar namnen på de kategorier som användaren har valt för övningen
const selectedCategoryNames = computed(() => {
  return categories
    .filter((cat) => selectedCategories.value.includes(cat.code))
    .map((cat) => cat.name)
    .join(", ");
});

// Öppnar sammanfattningsmodalen
function openSummaryModal() {
  showSummaryModal.value = true;
}

// Stänger modalen och nollställer allt tillbaka till startvyn
function closeSummaryAndReset() {
  showSummaryModal.value = false;
  questions.value = [];
  selectedCategories.value = [];
  currentIndex.value = 0;
  feedback.value = null;
  answeredCount.value = 0;
  selectedPosition.value = null;
  correctCount.value = 0;
}
</script>

<template>
  <section class="exercise-view">
    <!-- Välj kategorier-vyn -->
    <div v-if="questions.length === 0">
      <h1>Öva</h1>
      <p>Välj vilka områden du vill öva på. Övningen fortsätter tills du väljer att avbryta.</p>

      <div class="categories">
        <article
          v-for="category in categories"
          :key="category.code"
          class="category-card card"
          :class="{ selected: selectedCategories.includes(category.code) }"
          @click="selectCategory(category.code)"
        >
          <h2>{{ category.code }}</h2>
          <p>{{ category.name }}</p>
        </article>

        <button
          class="nav-btn primary start-btn"
          :disabled="selectedCategories.length === 0"
          @click="startExercise"
        >
          Starta övning
        </button>
      </div>
    </div>

    <!-- Frågevyn -->
    <div v-else-if="currentQuestion" class="exercise-container">
      <div class="exercise-header">
        <h2>Övningsläge</h2>
        <span class="question-counter">Fråga {{ currentIndex + 1 }}</span>
        <!-- Öppnar modal med sammanfattning -->
        <button class="nav-btn danger" @click="openSummaryModal">Avsluta övning</button>
      </div>

      <QuestionCard
        v-if="currentQuestion"
        :question="currentQuestion"
        v-model="selectedPosition"
        :disabled="feedback !== null"
        :result="feedback ? { isCorrect: feedback.isCorrect, correctPosition: feedback.correctPosition } : null"
        @update:modelValue="handleSelectAnswer"
      />

      <!-- Feedback-ruta -->
      <div v-if="feedback !== null" class="feedback-box card" :class="feedback.isCorrect ? 'success' : 'error'">
        <p class="feedback-title">
          {{ feedback.isCorrect ? 'Rätt svar!' : 'Fel svar.' }}
        </p>
        <div v-if="!feedback.isCorrect && feedback.explanation" class="explanation">
          <strong>Lösningsförslag / Förklaring:</strong>
          <p v-html="renderMath(feedback.explanation)"></p>
        </div>
      </div>

      <!-- Navigeringsknapp -->
      <div class="question-footer">
        <button class="nav-btn primary next-btn" @click="nextQuestion">
          {{ feedback !== null ? 'Nästa fråga' : 'Hoppa över / Nästa' }}
        </button>
      </div>
    </div>

    <!-- MODAL: Sammanfattning vid avslutad övning -->
    <div v-if="showSummaryModal" class="modal-backdrop">
      <div class="modal-card card">
        <h2>Övning avslutad</h2>
        <p>Bra jobbat! Här är en sammanfattning av din omgång:</p>
        
        <div class="stats-box">
          <!-- Visar vilka kategorier som övats på -->
          <div class="stat-row categories-row">
            <span>Kategorier:</span>
            <strong>{{ selectedCategoryNames || "Alla" }}</strong>
          </div>
          <div class="stat-row">
            <span>Besvarade frågor:</span>
            <strong>{{ answeredCount }}</strong>
          </div>
          <div class="stat-row">
            <span>Antal rätt:</span>
            <strong class="success-text">{{ correctCount }}</strong>
          </div>
          <div v-if="totalAnswered > 0" class="stat-row">
            <span>Träffsäkerhet:</span>
            <strong>{{ Math.round((correctCount / answeredCount) * 100) }} %</strong>
          </div>
        </div>
        <button class="nav-btn primary modal-close-btn" @click="closeSummaryAndReset">
          Tillbaka till start
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.exercise-view {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 20px;
}

@media (min-width: 640px) {
  .categories {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .start-btn {
    grid-column: span 2;
    margin-top: 10px;
  }
}

.category-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-card.selected {
  background: #2c3e50;
  color: #ffffff;
  border-color: #2c3e50;
  box-shadow: 0 4px 16px rgba(44, 62, 80, 0.2);
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.question-counter {
  font-weight: 600;
  color: #666;
}

.feedback-box {
  margin-top: 20px;
  padding: 16px;
}

.feedback-box.success {
  border-left: 4px solid #34a853;
  background: #e6f4ea;
  color: #137333;
}

.feedback-box.error {
  border-left: 4px solid #ea4335;
  background: #fce8e6;
  color: #c5221f;
}

.feedback-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
}

.explanation {
  margin-top: 8px;
  font-size: 14px;
  color: #333;
}

.question-footer {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.next-btn {
  padding: 10px 24px;
}

/* Modal Stilar */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 400px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-card h2 {
  margin-top: 0;
  color: #2c3e50;
}

.stats-box {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #555;
}

.success-text {
  color: #34a853;
}

.modal-close-btn {
  width: 100%;
  padding: 10px;
}
</style>