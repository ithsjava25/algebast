<script setup>
import { ref } from "vue";

const categories = [
    { code: "XYZ", name: "Matematik" },
    { code: "KVA", name: "Kvantitativa jämförelser" },
    { code: "NOG", name: "Kvantitativa resonemang" },
    { code: "DTK", name: "Diagram, tabeller och kartor" },
];

const selectedCategories = ref([]);

function selectCategory(code) {
  if (selectedCategories.value.includes(code)) {
    selectedCategories.value = selectedCategories.value.filter(
      category => category !== code
    );
  } else {
    selectedCategories.value.push(code);
  }
}
</script>

<template>
  <section>
    <h1>Öva</h1>
    <p>Välj vilka områden du vill öva på.</p>

    <div class="categories">
      <article
        v-for="category in categories"
        :key="category.code"
        class="category-card"
        :class="{ selected: selectedCategories.includes(category.code)}"
        @click="selectCategory(category.code)"
      >
        <h2>{{ category.code }}</h2>
        <p>{{ category.name }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.category-card {
  border: 1px solid #aaa;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 10px;
}

.category-card.selected {
  background: #111;
  color: #fff;
}
</style>