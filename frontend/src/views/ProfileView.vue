<script setup>
import { ref, watch, computed } from "vue";
import ResultCard from "@/components/ResultCard.vue";
import BadgesCard from "@/components/BadgesCard.vue";
import { getUserResults } from "@/services/userService.js";
import ExerciseStats from "@/components/ExerciseStats.vue";
import { getExterciseStats } from "@/services/userService.js";
import { getUserBadges } from "@/services/userService.js";
import ExamReviewModal from "@/components/ExamReviewModal.vue";
import { getExerciseHistory } from "@/services/userService.js";
import ExerciseHistoryModal from "@/components/ExerciseHistoryModal.vue";

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

const userBadges = ref([]); // Användarens pokaler
const isLoadingBadges = ref(false); // Indikator för laddning av pokaler
const badgeErrorMessage = ref(""); // Felmeddelande vid problem med att hämta pokaler

const activeAttemptId = ref(null); // Sparar valt attemptId för modalen

const selectedCategory = ref(null); // Sparar valt category för modalen
const exerciseHistory = ref([]); // Sparar historik för övningar i vald kategori
const isLoadingHistory = ref(false); // Indikator för laddning av historik
const historyErrorMessage = ref(""); // Felmeddelande vid problem med att hämta historik
let historyRequestId = 0; // Håller reda på senaste requestId för att undvika race conditions

const showAllResultsModal = ref(false);
const recentResults = computed(() => results.value.slice(0, 5));


// Hämta användarens övningsstatistik
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

// Hämta historik för övningar i vald kategori
async function loadExerciseHistory(category) {
  const requestId = ++historyRequestId;
  selectedCategory.value = category;
  exerciseHistory.value = [];
  isLoadingHistory.value = true;
  historyErrorMessage.value = "";

  try {
    const history = await getExerciseHistory(category);
    if (requestId === historyRequestId) {
      exerciseHistory.value = history;
    }
  } catch (erroro) {
    if (requestId === historyRequestId) {
      historyErrorMessage.value = "Kunde inte hämta övningshistoriken.";
    }
  } finally {
    if (requestId === historyRequestId) {
      isLoadingHistory.value = false;
    }
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
    <div v-if="user" class="profile-header">
      <h1>Välkommen {{ user.firstname }}!</h1>

      <RouterLink to="/account" class="nav-btn"> Hantera konto </RouterLink>
    </div>

    <h2>Övningsresultat</h2>

    <p v-if="isLoadingStats">Hämtar övningsstatistik...</p>
    <p v-else-if="statsErrorMessage" class="error-message">
      {{ statsErrorMessage }}
    </p>
    <ExerciseStats
      v-else
      :stats="exerciseStats"
      @select-category="loadExerciseHistory"
    />

    <ExerciseHistoryModal
      :category="selectedCategory"
      :history="exerciseHistory"
      :is-loading="isLoadingHistory"
      :error-message="historyErrorMessage"
      @close="selectedCategory = null"
    />

    <hr class="section-divider" />

    <h2>Provresultat</h2>

    <p v-if="isLoading">Hämtar provresultat...</p>
    <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <div v-else-if="results.length" class="results-container">
      <div class="results-list">
        <ResultCard
          v-for="result in recentResults"
          :key="result.attemptId"
          :result="result"
          @select="activeAttemptId = $event"
        />
      </div>

      <!-- Visa knappen endast om det finns fler än 5 resultat -->
      <button
        v-if="results.length > 5"
        class="nav-btn secondary show-all-btn"
        @click="showAllResultsModal = true"
      >
        Visa alla provresultat ({{ results.length }} st)
      </button>
    </div>

    <p v-else-if="user">Du har inga sparade provresultat ännu.</p>

    <!-- MODAL: Alla provresultat -->
    <div v-if="showAllResultsModal" class="modal-backdrop" @click.self="showAllResultsModal = false">
      <div class="modal-card card" role="dialog" aria-modal="true" aria-label="Alla provresultat">
        <div class="modal-header">
          <h2>Alla provresultat</h2>
          <button class="close-btn" @click="showAllResultsModal = false" aria-label="Stäng">✕</button>
        </div>

        <div class="all-results-scroll">
          <div class="results-list">
            <ResultCard
              v-for="result in results"
              :key="result.attemptId"
              :result="result"
              @select="showAllResultsModal = false; activeAttemptId = $event"
            />
          </div>
        </div>
      </div>
    </div>

    <ExamReviewModal
      v-if="activeAttemptId"
      :attempt-id="activeAttemptId"
      @close="activeAttemptId = null"
    />

    <hr class="section-divider" />

    <section class="profile-section">
      <h2>Pokaler</h2>
      <p v-if="isLoadingBadges">Hämtar pokaler...</p>
      <p v-else-if="badgeErrorMessage" class="error-message">
        {{ badgeErrorMessage }}
      </p>
      <BadgesCard v-else :badges="userBadges" />
    </section>
  </section>
</template>

<style scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-divider {
  border: 0;
  border-top: 1px solid var(--border-color);
  margin: 32px 0;
}

.results-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.show-all-btn {
  width: 100%;
  margin-top: 8px;
}

/* Modal Stilar */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  background: var(--bg-secondary);
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px 8px;
}

.all-results-scroll {
  overflow-y: auto;
  padding-right: 4px;
}
</style>
