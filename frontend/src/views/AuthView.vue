<script setup>
import RegisterForm from "@/components/RegisterForm.vue";
</script>

<template>
    <section class="auth-view">
        <h1>Välkommen till AlgeBäst</h1>
        <p>Logga in eller skapa ett konto för att spara dina resultat.</p>

        <div class="auth-actions">
            <button>Logga in</button>
            <button>Skapa konto</button>
        </div>
        <RegisterForm />
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
</style>