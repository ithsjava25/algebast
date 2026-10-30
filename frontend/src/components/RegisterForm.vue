<script setup>
import { ref } from "vue";
import { registerUser } from "@/services/userService.js";

const username = ref("");
const firstname = ref("");
const lastname = ref("");
const email = ref("");
const password = ref("");

const errorMessage = ref("");
const successMessage = ref("");
const emit = defineEmits(["registered"]);

async function handleSubmit() {
    errorMessage.value = "";
    successMessage.value = "";

    //  Validerar inputs
    if (
        !username.value.trim() ||
        !firstname.value.trim() ||
        !lastname.value.trim() ||
        !email.value.trim() ||
        !password.value
    ) {
        errorMessage.value = "Alla fält måste fyllas i.";
        return;
    }

    if (username.value.trim().length < 3) {
        errorMessage.value = "Användarnamnet måste vara minst 3 tecken långt.";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value)) {
        errorMessage.value = "Ange en giltig e-postadress.";
        return;
    }

    if (password.value.length < 8) {
        errorMessage.value = "Lösenordet måste vara minst 8 tecken långt.";
        return;
    }

    // Skickar registreringsdata till backend
   try {
        const user = await registerUser ({
            username: username.value.trim(),
            firstname: firstname.value.trim(),
            lastname: lastname.value.trim(),
            email: email.value.trim(),
            password: password.value,
        });

        successMessage.value = "Ditt konto har skapats! Du kan nu logga in.";
        emit("registered");
   } catch (error) {
    errorMessage.value = error.message;
   }
};

</script>

<template>
    <form class="register-form" @submit.prevent="handleSubmit">
        <div class="form-group">
        <label for="username">Användarnamn</label>
        <input
            id="username"
            v-model="username"
            type="text"
        />
        </div>

        <div class="form-group">
        <label for="firstname">Förnamn</label>
        <input
            id="firstname"
            v-model="firstname"
            type="text"
        />
        </div>

        <div class="form-group">
        <label for="lastname">Efternamn</label>
        <input
            id="lastname"
            v-model="lastname"
            type="text"
        />
        </div>

        <div class="form-group">
        <label for="email">E-postadress</label>
        <input
            id="email"
            v-model="email"
            type="email"
        />
        </div>

        <div class="form-group">
        <label for="password">Lösenord</label>
        <input
            id="password"
            v-model="password"
            type="password"
        />
        </div>

        <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </p>
        <p v-if="successMessage" class="success-message">
            {{ successMessage }}
        </p>

        <button type="submit">
        Skapa konto
        </button>
    </form>
</template>

<style scoped>
.register-form {
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
  border: 1px solid var(--border-strong);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font: inherit;
}
.register-form button {
  padding: 12px 16px;
  margin-top: 8px;
  cursor: pointer;
}
.error-message {
  margin: 0;
  font-size: 14px;
  color: var(--error-text);
}
.success-message {
  margin: 0;
  font-size: 14px;
  color: var(--success-text);
}
</style>