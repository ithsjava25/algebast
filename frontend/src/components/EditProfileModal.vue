<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
// import { updateUser } from "@/services/userService.js";

const props = defineProps({
  user: { type: Object, required: true },
});

const emit = defineEmits(["close", "saved"]);

// Kopia av värdena så att propen inte muteras
const form = ref({
  username: props.user.username,
  firstname: props.user.firstname,
  lastname: props.user.lastname,
  email: props.user.email,
});

const error = ref(null);
const isSaving = ref(false);

const firstInputRef = ref(null);
let previouslyFocusedElement = null;

async function save() {
  isSaving.value = true;
  error.value = null;

  try {
    emit("saved");
  } catch (err) {
    console.error(err);
    error.value = "Kunde inte spara ändringarna.";
  } finally {
    isSaving.value = false;
  }
}

function handleKeyDown(e) {
  if (e.key === "Escape") emit("close");
}

onMounted(() => {
  previouslyFocusedElement = document.activeElement;
  document.body.style.overflow = "hidden";
  nextTick(() => firstInputRef.value?.focus());
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", handleKeyDown);
  if (
    previouslyFocusedElement &&
    typeof previouslyFocusedElement.focus === "function"
  ) {
    previouslyFocusedElement.focus();
  }
});
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div
      class="modal-content"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <button class="close-btn" @click="emit('close')" aria-label="Stäng">
        ✕
      </button>

      <h2 id="edit-profile-title">Redigera profil</h2>

      <form @submit.prevent="save">
        <label>
          Användarnamn
          <input
            ref="firstInputRef"
            v-model="form.username"
            type="text"
            required
          />
        </label>

        <label>
          Förnamn
          <input v-model="form.firstname" type="text" required />
        </label>

        <label>
          Efternamn
          <input v-model="form.lastname" type="text" required />
        </label>

        <label>
          E-post
          <input v-model="form.email" type="email" required />
        </label>

        <p v-if="error" class="error-message">{{ error }}</p>

        <div class="modal-actions">
          <button type="button" class="nav-btn" @click="emit('close')">
            Avbryt
          </button>
          <button type="submit" class="nav-btn primary" :disabled="isSaving">
            {{ isSaving ? "Sparar..." : "Spara" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 15px;
}

.modal-content {
  background: var(--bg-primary);
  color: var(--text-primary);
  width: 100%;
  max-width: 460px;
  max-height: 88vh;
  overflow-y: auto;
  border-radius: 12px;
  position: relative;
  padding: 24px;
  box-sizing: border-box;
}

.close-btn {
  position: absolute;
  top: 14px;
  right: 18px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: var(--text-primary);
}

label {
  display: block;
  margin-bottom: 12px;
}

input {
  display: block;
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}
</style>
