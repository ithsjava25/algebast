<script setup>
import { ref, watch, nextTick } from "vue";
import ExerciseHistory from "@/components/ExerciseHistory.vue";
import { useScrollLock } from "@vueuse/core";

const props = defineProps({
  category: {
    type: String,
    default: null,
  },
  history: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close"]);
const dialogRef = ref(null);
const isScrollLocked = useScrollLock(document.body);

watch(
  () => props.category,
  async (category) => {
    await nextTick();

    if (category) {
      if (!dialogRef.value?.open) {
        dialogRef.value?.showModal();
      }

      isScrollLocked.value = true;
    } else {
      dialogRef.value?.close();
      isScrollLocked.value = false;
    }
  },
  { immediate: true },
);

function closeModal() {
  dialogRef.value?.close();
}

function handleDialogClose() {
  isScrollLocked.value = false;
  emit("close");
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="history-modal"
    aria-labelledby="history-modal-title"
    @close="handleDialogClose"
  >
    <div class="modal-header">
      <h2 id="history-modal-title">Övningshistorik: {{ category }}</h2>

      <button
        type="button"
        class="close-button"
        aria-label="Stäng övningshistoriken"
        @click="closeModal"
      >
        ✕
      </button>
    </div>

    <div class="modal-content">
      <p v-if="isLoading">Hämtar övningshistorik...</p>

      <p v-else-if="errorMessage" class="error-message" role="alert">
        {{ errorMessage }}
      </p>

      <ExerciseHistory v-else :history="history" />
    </div>
  </dialog>
</template>

<style scoped>
.history-modal {
  width: min(1000px, calc(100% - 32px));
  max-height: 85vh;
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  overflow: hidden;
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
}

.close-button {
  padding: 8px 12px;
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

.error-message {
  color: var(--error-text);
}

.modal-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 8px;

  /* Anpassad scrollbar */
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

/* Chrome, Edge och Safari */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>
