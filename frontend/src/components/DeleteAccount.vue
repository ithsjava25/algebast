<script setup>
import { ref } from "vue";
import { deleteAccount } from "@/services/userService.js";

const emit = defineEmits(["account-deleted"]);

const showConfirmation = ref(false);
const password = ref("");
const errorMessage = ref("");
const isDeleting = ref(false);

function closeConfirmation() {
  if (isDeleting.value) return;

  showConfirmation.value = false;
  password.value = "";
  errorMessage.value = "";
}

async function handleDeleteAccount() {
  if (!password.value || isDeleting.value) return;

  isDeleting.value = true;
  errorMessage.value = "";

  try {
    await deleteAccount(password.value);
    password.value = "";
    showConfirmation.value = false;

    emit("account-deleted");
  } catch (error) {
    errorMessage.value = error.message || "Kunde inte radera kontot.";
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <section class="delete-account">
    <h2>Radera konto</h2>

    <p>
      Om du raderar ditt konto försvinner dina uppgifter, provresultat och
      sparade övningssvar permanent.
    </p>

    <button
      type="button"
      class="delete-button"
      @click="showConfirmation = true"
    >
      Radera mitt konto
    </button>

    <div v-if="showConfirmation" class="confirmation">
      <h3>Är du säker?</h3>

      <p>
        Den här åtgärden går inte att ångra. Ange ditt lösenord för att
        bekräfta.
      </p>

      <form @submit.prevent="handleDeleteAccount">
        <label for="delete-password">Lösenord</label>

        <input
          id="delete-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          :disabled="isDeleting"
        />

        <p v-if="errorMessage" class="error-message" role="alert">
          {{ errorMessage }}
        </p>

        <div class="confirmation-actions">
          <button
            type="button"
            :disabled="isDeleting"
            @click="closeConfirmation"
          >
            Avbryt
          </button>

          <button
            type="submit"
            class="delete-button"
            :disabled="isDeleting || !password"
          >
            {{ isDeleting ? "Raderar..." : "Bekräfta radering" }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.delete-account {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.delete-account p {
  color: var(--text-secondary);
}

.delete-button {
  background: var(--danger-bg);
  color: var(--button-text);
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
}

.delete-button:hover:not(:disabled) {
  background: var(--danger-hover);
}

.confirmation {
  margin-top: 20px;
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.confirmation form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.confirmation input {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.confirmation-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.confirmation-actions button {
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: var(--error-text);
}
</style>
