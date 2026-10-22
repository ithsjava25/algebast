<script setup>
import { ref } from "vue";
import SideNav from "./components/SideNav.vue";

const currentUser = ref({
  id: 1,
  username: "testuser",
  firstname: "Test",
  lastname: "Testsson",
  email: "test@example.com",
});

function handleLogout() {
  // Kopplas till backendens session/logout senare
  currentUser.value = null;
}
</script>

<template>
  <div class="app-layout">
    <SideNav
      :user="currentUser"
      @logout="handleLogout"
    />
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