<script setup>
import SideNav from './components/SideNav.vue';
</script>

<template>
  <div class="app-layout">
    <SideNav />
    <main class="page-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.page-content {
  flex: 1 1 0;
  min-width: 0;
}
</style>

