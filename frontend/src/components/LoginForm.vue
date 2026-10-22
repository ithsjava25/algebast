<script setup>
import { ref } from "vue";
import { loginUser } from "@/services/userService.js";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const emit = defineEmits(["login"]);

async function handleSubmit() {
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

  try {
    const user = await loginUser(
      email.value.trim(),
      password.value,
    );
    emit("login", user);
  } catch (error) {
    errorMessage.value = error.message;
  }
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
      />
    </div>

    <div class="form-group">
      <label for="login-password">Lösenord</label>
      <input
        id="login-password"
        v-model="password"
        type="password"
      />
    </div>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <button type="submit">
      Logga in
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
  border: 1px solid #aaa;
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
  color: #b00020;
}
</style>