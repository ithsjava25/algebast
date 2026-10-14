<script setup></script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Tillgängliga prov</RouterLink>
      <RouterLink to="/test">Test</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
