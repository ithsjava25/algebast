<script setup>
import { ref, watch } from "vue";
import ResultCard from "@/components/ResultCard.vue";
import { getUserResults } from "@/services/userService.js";

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});

const results = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");

async function loadResults() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    results.value = await getUserResults();
  } catch (error) {
    errorMessage.value = "Kunde inte hämta provresultat.";
  } finally {
    isLoading.value = false;
  }
}

watch(
  () => props.user,
  (user) => {
    if (user) {
      loadResults();
    } else {
      results.value = [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <section class="profile-view">
    <h1 v-if="user">Hej {{ user.username }}</h1>

    <h2>Mina provresultat</h2>

    <p v-if="isLoading">Laddar provresultat...</p>

    <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div v-else-if="results.length" class="results-list">
      <ResultCard
        v-for="result in results"
        :key="result.attemptId"
        :result="result"
      />
    </div>
    <p v-else-if="user">Du har inga sparade provresultat ännu.</p>
  </section>
</template>

<style scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
