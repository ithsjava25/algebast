<script setup>
import { ref } from "vue";
import { changePassword } from "@/services/userService.js";

const form = ref({
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const error = ref(null);
const successMessage = ref("");
const isSaving = ref(false);

async function save() {
  error.value = null;
  successMessage.value = "";

  // Kontrollera att det nya lösenordet uppfyller minimikravet
  if (form.value.newPassword.length < 8) {
    error.value = "Det nya lösenordet måste vara minst 8 tecken.";
    return;
  }

  // Kontrollera att lösenorden överensstämmer
  if (form.value.newPassword !== form.value.confirmNewPassword) {
    error.value = "De nya lösenorden matchar inte.";
    return;
  }

  isSaving.value = true;

  try {
    await changePassword({
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword,
    });

    // Rensa formuläret efter lyckat lösenordsbyte
    form.value = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };

    successMessage.value = "Ditt lösenord har ändrats.";
  } catch (err) {
    console.error(err);
    error.value = err.message || "Kunde inte byta lösenord.";
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <section class="account-section">
    <h2>Byt lösenord</h2>

    <form @submit.prevent="save">
      <label>
        Nuvarande lösenord
        <input
          v-model="form.currentPassword"
          type="password"
          autocomplete="current-password"
          required
        />
      </label>

      <label>
        Nytt lösenord
        <input
          v-model="form.newPassword"
          type="password"
          autocomplete="new-password"
          minlength="8"
          required
        />
      </label>

      <label>
        Bekräfta nytt lösenord
        <input
          v-model="form.confirmNewPassword"
          type="password"
          autocomplete="new-password"
          minlength="8"
          required
        />
      </label>

      <p v-if="error" class="error-message" role="alert">
        {{ error }}
      </p>

      <p v-if="successMessage" class="success-message" role="status">
        {{ successMessage }}
      </p>

      <button type="submit" class="nav-btn primary" :disabled="isSaving">
        {{ isSaving ? "Byter lösenord..." : "Byt lösenord" }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.account-section {
  margin-bottom: 0;
}

form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  width: 100%;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  box-sizing: border-box;
}
</style>
