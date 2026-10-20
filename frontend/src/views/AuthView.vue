<script setup>
import { ref } from "vue";
import RegisterForm from "@/components/RegisterForm.vue";
import LoginForm from "@/components/LoginForm.vue";

const authMode = ref("register");

function showLogin() {
    authMode.value = "login";
}
</script>

<template>
    <section class="auth-view">
        <h1>Välkommen till AlgeBäst</h1>
        <p>Logga in eller skapa ett konto för att spara dina resultat.</p>

        <RegisterForm
            v-if="authMode === 'register'"
            @registered="showLogin"
        />

        <button
            v-if="authMode === 'register'"
            type="button"
            @click="authMode = 'login'"
            >
            Har du redan ett konto? Logga in
        </button>

        <div v-else>
            <h2>Logga in</h2>
            <p>Ditt konto är skapat. Du kan nu logga in.</p>

            <LoginForm />
        </div>
    </section>
</template>

<style scoped>
.auth-view {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 20px;
}

.auth-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.auth-view button {
width: 100%;
  padding: 12px 16px;
  margin-top: 8px;
  cursor: pointer;
}
</style>