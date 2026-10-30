<script setup>
import { computed } from "vue";

const props = defineProps({
  stats: {
    type: Array,
    required: true,
  },
});

const categories = [
  { code: "XYZ", name: "Matematik" },
  { code: "KVA", name: "Kvantitativa jämförelser" },
  { code: "NOG", name: "Kvantitativa resonemang" },
  { code: "DTK", name: "Diagram, tabeller och kartor" },
];

// Beräkna statistik per kategori
const categoryStats = computed(() =>
  categories.map((category) => {
    const result = props.stats.find((stat) => stat.category === category.code);

    const answered = Number(result?.answered ?? 0);
    const correct = Number(result?.correct ?? 0);

    return {
      ...category,
      answered,
      correct,
      percentage: answered ? Math.round((correct / answered) * 100) : 0,
    };
  }),
);

// Beräkna totaler för alla kategorier
const totalAnswered = computed(() =>
  categoryStats.value.reduce((sum, category) => sum + category.answered, 0),
);
// Beräkna totalen för alla rätta svar
const totalCorrect = computed(() =>
  categoryStats.value.reduce((sum, category) => sum + category.correct, 0),
);
// Beräkna totalprocenten för alla kategorier
const totalPercentage = computed(() =>
  totalAnswered.value
    ? Math.round((totalCorrect.value / totalAnswered.value) * 100)
    : 0,
);
</script>

<template>
  <section class="exercise-stats">
    <div class="stats-summary">
      <p><strong>Besvarade frågor:</strong> {{ totalAnswered }}</p>
      <p><strong>Antal rätt:</strong> {{ totalCorrect }}</p>
      <p><strong>Träffsäkerhet:</strong> {{ totalPercentage }}%</p>
    </div>
    <div class="category-list">
      <article
        v-for="category in categoryStats"
        :key="category.code"
        class="category-result"
      >
        <div class="category-header">
          <h3>{{ category.code }}</h3>
          <h3>{{ category.percentage }}%</h3>
        </div>

        <p>{{ category.name }}</p>
        <p>{{ category.correct }} / {{ category.answered }} rätt</p>

        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${category.percentage}%` }"
          ></div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.exercise-stats {
  width: 100%;
}

.stats-summary {
  padding: 24px;
  margin-bottom: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.stats-summary p {
  margin: 0 0 10px;
  font-size: 14px;
}

.stats-summary p:last-child {
  margin-bottom: 0;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.category-result {
  padding: 24px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-header h3 {
  margin: 0;
  font-size: 18px;
}

.category-header span {
  font-weight: 700;
}

.category-result p {
  margin: 10px 0;
  font-size: 14px;
}

.progress-bar {
  width: 100%;
  height: 20px;
  margin-top: 16px;
  background: var(--bg-muted);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--button-bg);
  border-radius: 4px;
}

@media (max-width: 640px) {
  .category-list {
    grid-template-columns: 1fr;
  }
}
</style>
