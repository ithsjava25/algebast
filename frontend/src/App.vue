<script setup>
import { ref, onMounted } from "vue";
import SideNav from "./components/SideNav.vue";
import { useRouter } from "vue-router";
import { getCurrentUser, logoutUser } from "@/services/userService.js";

const router = useRouter();
const currentUser = ref(null);

async function loadCurrentUser() {
  try {
    currentUser.value = await getCurrentUser();
  } catch (error) {
    console.error("Kunde inte hämta inloggad användare");
  }
}

async function handleLogout() {
  try {
    await logoutUser();

    currentUser.value = null;
    router.push("/auth");
  } catch (error) {
    console.error("Utloggningen misslyckades");
  }
}

onMounted(() => {
  loadCurrentUser();
});

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