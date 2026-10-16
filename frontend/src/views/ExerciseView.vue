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

  console.log(questions.value);
}
</script>

<template>
  <section class="exercise-view">
    <div v-if="questions.length === 0">
      <h1>Öva</h1>
      <p>Välj vilka områden du vill öva på.</p>

      <div class="categories">
        <article
          v-for="category in categories"
          :key="category.code"
          class="category-card"
          :class="{ selected: selectedCategories.includes(category.code) }"
          @click="selectCategory(category.code)"
        >
          <h2>{{ category.code }}</h2>
          <p>{{ category.name }}</p>
        </article>

        <button
          :disabled="selectedCategories.length === 0"
          @click="startExercise"
        >
          Starta övning
        </button>
      </div>
    </div>
    <div v-else class="questions">
      <QuestionCard
        v-for="question in questions"
        :key="question.id"
        :question="question"
      />
    </div>
  </section>
</template>

<style scoped>
.exercise-view {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}
.categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 30px;
}
.category-card {
  width: 100%;
  border: 1px solid #aaa;
  padding: 10px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.category-card.selected {
  background: #111;
  color: #fff;
}
</style>
