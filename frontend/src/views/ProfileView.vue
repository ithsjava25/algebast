<script setup>
import { ref, watch, computed, nextTick } from "vue";
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
const dialogRef = ref(null);
const fromAllResults = ref(false); // Indikerar om modalen öppnades från "Visa alla provresultat"-knappen
const recentResults = computed(() => results.value.slice(0, 3)); // Visar de tre senaste resultaten


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

watch(showAllResultsModal, async (isOpen) => {
  await nextTick();
  if (isOpen) {
    if (!dialogRef.value?.open) {
      dialogRef.value?.showModal();
    }
  } else {
    dialogRef.value?.close();
  }
});

function openAllResultsModal() {
  showAllResultsModal.value = true;
}

function closeAllResultsModal() {
  showAllResultsModal.value = false;
}

// Hantera öppning av granskning från "Alla prov"-modalen
function openReviewFromAll(attemptId) {
  fromAllResults.value = true;
  activeAttemptId.value = attemptId;
}

// Hantera stängning av granskningsmodalen
function handleReviewClose() {
  activeAttemptId.value = null;
  
  // Om vi kom från "Alla prov"-modalen öppnar vi den igen
  if (fromAllResults.value) {
    showAllResultsModal.value = true;
    fromAllResults.value = false;
  }
}

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
          @select="fromAllResults = falseactiveAttemptId = $event"
        />
      </div>

      <!-- Visa knappen endast om det finns fler än 3 resultat -->
      <button
        v-if="results.length > 3"
        class="nav-btn secondary show-all-btn"
        @click="openAllResultsModal"
      >
        Visa alla provresultat ({{ results.length }} st)
      </button>
    </div>

    <p v-else-if="user">Du har inga sparade provresultat ännu.</p>

    <!-- MODAL: Alla provresultat -->
    <dialog
      ref="dialogRef"
      class="history-modal"
      aria-labelledby="all-results-title"
      @close="closeAllResultsModal"
    >
      <div class="modal-header">
        <h2 id="all-results-title">Alla provresultat</h2>
        <button
          type="button"
          class="close-button"
          aria-label="Stäng"
          @click="closeAllResultsModal"
        >
          ✕
        </button>
      </div>

      <div class="modal-content">
        <div class="results-list">
          <ResultCard
            v-for="result in results"
            :key="result.attemptId"
            :result="result"
            @select="closeAllResultsModal(); openReviewFromAll($event)"
          />
        </div>
      </div>
    </dialog>

    <ExamReviewModal
      v-if="activeAttemptId"
      :attempt-id="activeAttemptId"
      @close="handleReviewClose"
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

.history-modal {
  width: min(600px, calc(100% - 32px));
  max-height: 80vh;
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: none; /* Dold som standard, visas via [open] */
}

.history-modal[open] {
  display: flex;
  flex-direction: column;
}

.history-modal::backdrop {
  background: rgba(0, 0, 0, 0.65);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.modal-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.close-button {
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-primary);
  font-size: 1.4rem;
  cursor: pointer;
}

.close-button:hover {
  opacity: 0.7;
}
</style>
