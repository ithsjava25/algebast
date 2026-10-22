<script setup>
import { ref } from "vue";

defineProps({
  user: {
    type: Object,
    default: null,
  },
});

const menuItems = [
    { label: "Hem", route: "/" },
    { label: "Prov", route: "/exams" },
    { label: "Öva", route: "/exercises" },
    { label: "Resultat", route: "/results" },
    { label: "Profil", route: "/auth" }
];

const emit = defineEmits(["logout"]);
const isMobileMenuOpen = ref(false);

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}
</script>

<template>
  <!-- Mobil-header -->
  <header class="mobile-header">
    <div class="brand">
      <span class="brand-mark">AB</span>
      <span class="brand-name">algeBäst</span>
    </div>
    <button
      class="menu-toggle-btn"
      @click="isMobileMenuOpen = !isMobileMenuOpen"
    >
      {{ isMobileMenuOpen ? "✕ Stäng" : "☰ Meny" }}
    </button>
  </header>

  <!-- Sidomeny -->
  <aside class="side-nav" :class="{ 'mobile-open': isMobileMenuOpen }">
    <div class="brand desktop-brand">
      <span class="brand-mark">AB</span>
      <span class="brand-name">algeBäst</span>
    </div>
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
    <div v-if="user" class="user-section">
        <div class="user-info">
            <span class="user-label">Inloggad som</span>
            <strong>{{ user.username }}</strong>
        </div>

        <button
            type="button"
            class="logout-button"
            @click="emit('logout')"
        >
            Logga ut
        </button>
    </div>
  </aside>
</template>

<style scoped>
/* Fast sidomeny */
.side-nav {
  width: 220px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-right: 1px solid #dcdde1;
  background: #f5f5f3;
  padding: 24px 18px;
  font-family: "Space Mono", monospace, sans-serif;
  box-sizing: border-box;
}

.desktop-brand {
  display: none;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  background: #111;
  color: white;
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
  color: #2c3e50;
  font-family: "Space Mono", monospace;
}

.menu-label {
  margin-top: 30px;
  margin-bottom: 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #7f8c8d;
}

.side-nav nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  padding: 12px 14px;
  color: #2c3e50;
  text-decoration: none;
  font-family: "Space Mono", monospace;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.nav-item:hover {
  background: #e5e5e2;
}

.nav-item.router-link-exact-active {
  background: #2c3e50;
  color: #fff;
}

/* Mobil-header (dold på desktop) */
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f3;
  border-bottom: 1px solid #dcdde1;
  padding: 12px 20px;
  width: 100%;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 100;
}

.menu-toggle-btn {
  background: #2c3e50;
  color: white;
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
    background: #f5f5f3;
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
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #dcdde1;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.user-label {
  font-size: 10px;
  color: #7f8c8d;
  letter-spacing: 0.05em;
}

.user-info strong {
  font-size: 13px;
}

.logout-button {
  width: 150px;
  padding: 9px 12px;
  border: 1px solid #dcdde1;
  border-radius: 8px;
  background: transparent;
  color: #2c3e50;
  font-family: "Space Mono", monospace;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.logout-button:hover {
  background: #e5e5e2;
}
</style>
