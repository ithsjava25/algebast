<script setup>
import { ref } from "vue";
import { loginUser } from "@/services/userService.js";
import { claimPendingExam } from "@/services/questionService.js";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const emit = defineEmits(["login"]);
const props = defineProps({
  isLoggingOut: {
    type: Boolean,
    default: false,
  },
});

async function handleSubmit() {
  if (props.isLoggingOut) return;

  errorMessage.value = "";

  if (!email.value.trim() || !password.value) {
    errorMessage.value = "E-postadress och lösenord måste fyllas i.";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.value)) {
    errorMessage.value = "Ange en giltig e-postadress.";
    return;
  }

  let user;
  try {
    user = await loginUser(email.value.trim(), password.value);
  } catch (error) {
    errorMessage.value = error.message;
    return;
  }

  // Logged in: save a pending guest exam, if there is one
  try {
    await claimPendingExam();
  } catch (err) {
    console.error(err);
    errorMessage.value =
      "Du är inloggad, men provet kunde inte sparas. Försök logga in igen.";
    return;
  }

  emit("login", user);
}
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="login-email">E-postadress</label>
      <input
        id="login-email"
        v-model="email"
        type="email"
        :disabled="isLoggingOut"
      />
    </div>

    <div class="form-group">
      <label for="login-password">Lösenord</label>
      <input
        id="login-password"
        v-model="password"
        type="password"
        :disabled="isLoggingOut"
      />
    </div>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <button type="submit" :disabled="isLoggingOut">
      {{ isLoggingOut ? "Loggar ut..." : "Logga in" }}
    </button>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid var(--input-border);
  font: inherit;
}

.login-form button {
  padding: 12px 16px;
  margin-top: 8px;
  cursor: pointer;
}

.auth-view button {
  padding: 12px 16px;
  margin-top: 8px;
  cursor: pointer;
}

.error-message {
  margin: 0;
  font-size: 14px;
  color: var(--error-message);
}
</style>
