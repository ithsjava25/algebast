<script setup>
import { ref } from "vue";
import { getRandomQuestionsByCategories } from "@/services/questionService.js";
import QuestionCard from "@/components/QuestionCard.vue";

const categories = [
  { code: "XYZ", name: "Matematik" },
  { code: "KVA", name: "Kvantitativa jämförelser" },
  { code: "NOG", name: "Kvantitativa resonemang" },
  { code: "DTK", name: "Diagram, tabeller och kartor" },
];

const selectedCategories = ref([]);
const questions = ref([]);

function selectCategory(code) {
  if (selectedCategories.value.includes(code)) {
    selectedCategories.value = selectedCategories.value.filter(
      (category) => category !== code,
    );
  } else {
    selectedCategories.value.push(code);
  }
}

async function startExercise() {
  questions.value = await getRandomQuestionsByCategories(
    selectedCategories.value,
    10,
  );
}

function resetExercise() {
  questions.value = [];
  selectedCategories.value = [];
}
</script>

<template>
  <section class="exercise-view">
    <!-- Välj kategorier-vyn -->
    <div v-if="questions.length === 0">
      <h1>Öva</h1>
      <p>Välj vilka områden du vill öva på.</p>

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

    <!-- Frågevyn när övningen har startat -->
    <div v-else class="questions-container">
      <div class="exercise-header">
        <h2>Övning pågår</h2>
        <button class="nav-btn" @click="resetExercise">Avbryt / Välj nya</button>
      </div>

      <div class="questions-list">
        <QuestionCard
          v-for="question in questions"
          :key="question.id"
          :question="question"
        />
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

/* På större skärmar (tablets/desktop) blir det 2 kolumner */
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

/* Kategorikort */
.category-card {
  cursor: pointer;
}

.category-card.selected {
  background: #2c3e50;
  color: #ffffff;
  border-color: #2c3e50;
  box-shadow: 0 4px 16px rgba(44, 62, 80, 0.2);
}

.category-card h2 {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 700;
}

.category-card p {
  margin: 0;
  font-size: 14px;
  color: inherit;
  opacity: 0.85;
}

/* Header för frågevyn */
.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>