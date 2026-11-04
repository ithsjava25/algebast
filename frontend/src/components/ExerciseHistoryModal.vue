<script setup>
import { ref, watch, nextTick } from "vue";
import ExerciseHistory from "@/components/ExerciseHistory.vue";

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

watch(
  () => props.category,
  async (category) => {
    await nextTick();

    if (category) {
      if (!dialogRef.value?.open) {
        dialogRef.value?.showModal();
      }
    } else {
      dialogRef.value?.close();
    }
  },
  { immediate: true },
);

function closeModal() {
  dialogRef.value?.close();
  emit("close");
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="history-modal"
    aria-labelledby="history-modal-title"
    @close="emit('close')"
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

.modal-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
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

.modal-content {
  overflow-y: auto;
}

.error-message {
  color: var(--error-text);
}
</style>
