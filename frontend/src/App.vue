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
  flex-direction: column; 
  min-height: 100vh;
  width: 100%;
  background-color: #f8f9fa;
}

.page-content {
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
}

@media (min-width: 768px) {
  .app-layout {
    flex-direction: row;
  }
}
</style>