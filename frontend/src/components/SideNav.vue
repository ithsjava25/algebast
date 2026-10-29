<script setup>
import { ref, computed } from "vue";
import { useColorMode } from "@vueuse/core";
import { Sun, Moon } from "lucide-vue-next";

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});

const menuItems = computed(() => [
  { label: "Hem", route: "/" },
  { label: "Om", route: "/about" },
  { label: "Prov", route: "/exams" },
  { label: "Övning", route: "/exercises" },
  {
    label: "Profil",
    route: props.user ? "/profile" : "/auth",
  },
]);

const emit = defineEmits(["logout"]);
const isMobileMenuOpen = ref(false);
// Hantera mörkt/ljust läge 
const colorMode = useColorMode({ emitAuto: true, modes: { light: "" } });
// Kontrollera om det är mörkt läge
const isDark = computed(() => colorMode.state.value === "dark");

function toggleDark() {
  colorMode.value = isDark.value ? "light" : "dark";
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}
</script>

<template>
  <!-- Mobil-header -->
  <header class="mobile-header">
    <RouterLink to="/" class="brand">
      <span class="brand-mark">AB</span>
      <span class="brand-name">AlgeBäst</span>
    </RouterLink>
    <button
      class="menu-toggle-btn"
      @click="isMobileMenuOpen = !isMobileMenuOpen"
    >
      {{ isMobileMenuOpen ? "✕ Stäng" : "☰ Meny" }}
    </button>
  </header>

  <!-- Sidomeny -->
  <aside class="side-nav" :class="{ 'mobile-open': isMobileMenuOpen }">
    <RouterLink to="/" class="brand desktop-brand">
      <span class="brand-mark">AB</span>
      <span class="brand-name">AlgeBäst</span>
    </RouterLink>
    <div class="menu-label">MENY</div>
    <nav @click="closeMobileMenu">
      <RouterLink
        v-for="item in menuItems"
        :key="item.route"
        :to="item.route"
        class="nav-item"
        active-class="nav-active"
        exact-active-class="nav-active"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
    <button class="theme-toggle" @click="toggleDark()">
      <Sun v-if="isDark" :size="18" />
      <Moon v-else :size="18" />
      {{ isDark ? "Ljust läge" : "Mörkt läge" }}
    </button>
    <div v-if="user" class="user-section">
      <div class="user-info">
        <span class="user-label">Inloggad som</span>
        <strong>{{ user.username }}</strong>
      </div>

      <button type="button" class="logout-button" @click="emit('logout')">
        Logga ut
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* Fast sidomeny */
.side-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  min-height: 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid var(--border-color);
  background: var(--bg-sidebar);
  padding: 24px 18px;
  font-family: "Space Mono", monospace, sans-serif;
  box-sizing: border-box;
}

.desktop-brand {
  display: none;
}

.brand {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  background: var(--brand-bg);
  color: var(--button-primary-text);
  font-weight: 700;
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 4px;
  font-family: "Space Mono", monospace;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  font-family: "Space Mono", monospace;
}

.menu-label {
  margin-top: 30px;
  margin-bottom: 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.side-nav nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  padding: 12px 14px;
  color: var(--text-primary);
  text-decoration: none;
  font-family: "Space Mono", monospace;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.nav-item:hover {
  background: var(--hover-color);
}

.nav-item.nav-active {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
}

/* Mobil-header (dold på desktop) */
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-sidebar);
  border-bottom: 1px solid var(--border-color);
  padding: 12px 20px;
  width: 100%;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 100;
}

.menu-toggle-btn {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-family: "Space Mono", monospace;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

/* Media query för mobil / mindre skärmar */
@media (max-width: 767px) {
  .side-nav {
    position: fixed;
    top: 57px; /* Direkt under mobil-headern */
    left: 0;
    width: 100%;
    height: calc(100vh - 57px);
    overflow-y: auto;
    background: var(--bg-sidebar);
    z-index: 99;
    transform: translateX(-100%);
    visibility: hidden;
    transition:
      transform 0.25s ease-in-out,
      visibility 0s linear 0.25s;
    border-right: none;
    padding-bottom: 80px;
  }

  .side-nav.mobile-open {
    transform: translateX(0);
    visibility: visible;
    transition:
      transform 0.25s ease-in-out,
      visibility 0s linear 0s;
  }

  .desktop-brand {
    display: none;
  }
}

/* Media query för desktop */
@media (min-width: 768px) {
  .mobile-header {
    display: none;
  }

  .desktop-brand {
    display: flex;
    margin-bottom: 20px;
  }
}

.user-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.user-label {
  font-size: 10px;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}

.user-info strong {
  font-size: 13px;
}

.logout-button {
  width: 150px;
  padding: 9px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: transparent;
  color: var(--text-primary);
  font-family: "Space Mono", monospace;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.logout-button:hover {
  background: var(--hover-color);
}

.theme-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: transparent;
  color: var(--text-primary);
  font-family: "Space Mono", monospace;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.theme-toggle:hover {
  background: var(--hover-color);
}

.theme-toggle + .user-section {
  margin-top: 16px;
}
</style>
