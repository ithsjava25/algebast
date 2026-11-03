<script setup>
import { ref, watch } from "vue";
import ResultCard from "@/components/ResultCard.vue";
import BadgesCard from "@/components/BadgesCard.vue";
import { getUserResults } from "@/services/userService.js";
import ExerciseStats from "@/components/ExerciseStats.vue";
import { getExterciseStats } from "@/services/userService.js";
import { getUserBadges } from "@/services/userService.js";
import DeleteAccount from "@/components/DeleteAccount.vue";

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});

const exerciseStats = ref([]); // Användarens övningsstatistik
const isLoadingStats = ref(false); // Indikator för laddning av övningsstatistik
const statsErrorMessage = ref(""); // Felmeddelande vid problem med att hämta övningsstatistik

const results = ref([]); // Användarens provresultat
const isLoading = ref(false); // Indikator för laddning av provresultat
const errorMessage = ref(""); // Felmeddelande vid problem med att hämta provresultat

const userBadges = ref([]);
const isLoadingBadges = ref(false);
const badgeErrorMessage = ref("");

const emit = defineEmits(["account-deleted"]); // Emit event för att meddela när kontot har raderats

async function loadExterciseStats() {
  isLoadingStats.value = true;
  statsErrorMessage.value = "";

  try {
    exerciseStats.value = await getExterciseStats();
  } catch (error) {
    statsErrorMessage.value = "Kunde inte hämta övningsstatistiken.";
  } finally {
    isLoadingStats.value = false;
  }
}

// Hämta användarens provresultat
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

async function loadBadges() {
  isLoadingBadges.value = true;
  badgeErrorMessage.value = "";

  try {
    userBadges.value = await getUserBadges();
  } catch (error) {
    badgeErrorMessage.value = "Kunde inte hämta pokaler.";
  } finally {
    isLoadingBadges.value = false;
  }
}

watch(
  () => props.user,
  (user) => {
    if (user) {
      loadExterciseStats();
      loadResults();
      loadBadges();
    } else {
      exerciseStats.value = [];
      results.value = [];
      userBadges.value = [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <section class="profile-view">
    <h1 v-if="user">Hej {{ user.firstname }}</h1>

    <h2>Mina övningsresultat</h2>

    <p v-if="isLoadingStats">Hämtar övningsstatistik...</p>
    <p v-else-if="statsErrorMessage" class="error-message">
      {{ statsErrorMessage }}
    </p>
    <ExerciseStats v-else :stats="exerciseStats" />

    <h2>Mina provresultat</h2>

    <p v-if="isLoading">Hämtar provresultat...</p>
    <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <div v-else-if="results.length" class="results-list">
      <ResultCard
        v-for="result in results"
        :key="result.attemptId"
        :result="result"
      />
    </div>

    <p v-else-if="user">Du har inga sparade provresultat ännu.</p>

    <section class="profile-section">
      <h2>Mina pokaler</h2>
      <p v-if="isLoadingBadges">Hämtar pokaler...</p>
      <p v-else-if="badgeErrorMessage" class="error-message">
        {{ badgeErrorMessage }}
      </p>
      <BadgesCard v-else :badges="userBadges" />
    </section>
    <DeleteAccount @account-deleted="emit('account-deleted')" />
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
