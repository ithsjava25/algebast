<script setup>
import EditProfileForm from "@/components/EditProfileForm.vue";
import ChangePasswordForm from "@/components/ChangePasswordForm.vue";
import DeleteAccount from "@/components/DeleteAccount.vue";

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["profile-updated", "account-deleted"]);
</script>

<template>
  <section class="account-settings">
    <div class="account-header">
      <h1>Hantera konto</h1>
      <RouterLink to="/profile" class="nav-btn"> Tillbaka </RouterLink>
    </div>
    <template v-if="props.user">
      <EditProfileForm
        :user="props.user"
        @saved="emit('profile-updated', $event)"
      />

      <hr class="section-divider" />

      <ChangePasswordForm />

      <hr class="section-divider" />

      <DeleteAccount @account-deleted="emit('account-deleted')" />
    </template>
  </section>
</template>

<style scoped>
.account-settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.section-divider {
  border: 0;
  border-top: 1px solid var(--border-color);
  margin: 32px 0;
}
</style>
