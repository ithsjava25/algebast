<script setup>
const menuItems = [
    { label: "Hem", route: "/" },
    { label: "Prov", route: "/exams" },
    { label: "Öva", route: "/test" },
    { label: "Resultat", route: "/results" },
    { label: "Profil", route: "/profile" }
];
</script>

<template>
    <aside class="side-nav">
        <div class="brand">
            <span class="brand-mark">HP</span>
            <span class="brand-name">MATTE</span>
        </div>
        <div class="menu-label">MENY</div>
        <nav>
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
    </aside>
</template>

<style scoped>
.side-nav nav {
    width: 150px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    border-right: 1px solid #aeb0b5;
    background: #f5f5f3;
    padding: 18px 22px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
}

.brand-mark {
  background: #111;
  color: white;
  font-weight: 700;
  padding: 7px 8px;
  font-size: 14px;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.menu-label {
  margin-bottom: 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #777;
}

.side-nav nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  padding: 10px 12px;
  color: #222;
  text-decoration: none;
  font-family: "Space Mono", monospace;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 600;
}

.nav-item:hover {
  background: #e5e5e2;
}

.nav-item.router-link-exact-active {
  background: #111;
  color: #fff;
}
</style>

