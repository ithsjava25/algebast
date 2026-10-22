<script setup>
defineProps({
  user: {
    type: Object,
    default: null,
  },
});
</script>

<template>
  <section class="profile-view">
    <h1 v-if="user">
      Hej {{ user.username }}
    </h1>
  </section>
</template>

<style scoped>
.profile-view {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}
</style>