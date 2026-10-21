<script setup>
</script>

<template>
  <main class="home-view">
    <section class="hero">
      <h1>ALGEBÄST</h1>
      <p>Träna och förbered dig inför högskoleprovet</p>
    </section>

    <section class="dashboard-actions">
      <article class="dashboard-card card">
        <h2>Prov</h2>
        <p>
          Gör hela högskoleprov eller specifika provpass under tidspress för att simulera den riktiga provsituationen.
        </p>

        <RouterLink to="/exams" class="nav-btn primary action-btn">
          Välj prov
        </RouterLink>
      </article>

      <article class="dashboard-card card">
        <h2>Öva</h2>
        <p>
          Träna på XYZ, KVA, NOG och DTK genom att själv välja vilka kategorier du vill fokusera på.
        </p>

        <RouterLink to="/exercises" class="nav-btn primary action-btn">
          Börja öva
        </RouterLink>
      </article>
    </section>
  </main>
</template>

<style scoped>
.home-view {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.hero {
  text-align: center;
  margin-bottom: 32px;
}

.hero h1 {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -1px;
  margin-bottom: 8px;
  color: #2c3e50;
}

.hero p {
  color: #7f8c8d;
  font-size: 16px;
  margin: 0;
}

/* Mobile-first: 1 kolumn */
.dashboard-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

/* På större skärmar: 2 kolumner */
@media (min-width: 640px) {
  .dashboard-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

.dashboard-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}

.dashboard-card h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
}

.dashboard-card p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
}

/* Knappstil för RouterLink */
.action-btn {
  display: inline-block;
  text-align: center;
  text-decoration: none;
  width: 100%;
}
</style>