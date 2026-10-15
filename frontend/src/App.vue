<script setup>
import SideNav from './components/SideNav.vue';
</script>

<template>
  <div class="app-layout">
    <SideNav />
    <main class="page-conntent">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.page-content {
  flex: 2;
}
</style>

