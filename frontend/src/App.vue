<script setup>
import { ref, onMounted } from "vue";
import SideNav from "./components/SideNav.vue";
import {
  useRouter,
  isNavigationFailure,
  NavigationFailureType,
} from "vue-router";
import { getCurrentUser, logoutUser } from "@/services/userService.js";

const router = useRouter();
const currentUser = ref(null);
const isLoggingOut = ref(false);

function handleLogin(user) {
  if (isLoggingOut.value) return;

  currentUser.value = user;
  router.push("/");
}

async function loadCurrentUser() {
  try {
    currentUser.value = await getCurrentUser();
  } catch (error) {
    console.error("Kunde inte hämta inloggad användare");
  }
}

async function handleLogout() {
  if (isLoggingOut.value) {
    return;
  }

  isLoggingOut.value = true;

  try {
    const navigationFailure = await router.push("/auth");

    // Om navigationen misslyckas (t.ex avbryts av användaren), avbryt utloggningen
    if (
      navigationFailure &&
      !isNavigationFailure(navigationFailure, NavigationFailureType.duplicated)
    ) {
      return;
    }

    await logoutUser();
    currentUser.value = null;
  } catch (error) {
    console.error("Utloggningen misslyckades", error);
  } finally {
    isLoggingOut.value = false;
  }
}

onMounted(() => {
  loadCurrentUser();
});
</script>

<template>
  <div class="app-layout">
    <SideNav :user="currentUser" @logout="handleLogout" />
    <main class="page-content">
      <RouterView v-slot="{ Component }">
        <component
          :is="Component"
          :user="currentUser"
          :is-logging-out="isLoggingOut"
          @login="handleLogin"
        />
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: var(--bg-primary);
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

  .page-content {
    margin-left: 220px;
    width: calc(100% - 220px);
  }
}
</style>
