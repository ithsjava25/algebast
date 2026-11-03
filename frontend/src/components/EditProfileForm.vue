<script setup>
import { ref } from "vue";
import { updateUser } from "@/services/userService.js";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["saved"]);

const form = ref({
  username: props.user.username,
  firstname: props.user.firstname,
  lastname: props.user.lastname,
  email: props.user.email,
});

const error = ref(null);
const isSaving = ref(false);

async function save() {
  isSaving.value = true;
  error.value = null;

  try {
    const updatedUser = await updateUser({
      username: form.value.username,
      firstname: form.value.firstname,
      lastname: form.value.lastname,
      email: form.value.email,
    });

    emit("saved", updatedUser);
  } catch (err) {
    console.error(err);
    error.value = err.message || "Kunde inte spara ändringarna.";
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <section class="account-section">
    <h2>Personuppgifter</h2>

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

      <button type="submit" class="nav-btn primary" :disabled="isSaving">
        {{ isSaving ? "Sparar..." : "Spara ändringar" }}
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

button {
  width: auto;
}
</style>
