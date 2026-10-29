<script setup></script>

<template>
  <div class="home-view">
    <section class="hero">
      <h1>AlgeBäst</h1>
      <p>Öva och förbered dig inför högskoleprovet!</p>
    </section>

    <section class="dashboard-actions">
      <article class="dashboard-card card">
        <h2>Gör ett prov</h2>
        <p>
          Gör ett högskoleprovpass under tidspress för att simulera den riktiga
          provsituationen.
        </p>

        <RouterLink to="/exams" class="nav-btn primary action-btn">
          Välj prov
        </RouterLink>
      </article>

      <article class="dashboard-card card">
        <h2>Starta en övning</h2>
        <p>
          Öva genom att själv välja vilka frågekategorier du vill fokusera på.
        </p>

        <RouterLink to="/exercises" class="nav-btn primary action-btn">
          Börja öva
        </RouterLink>
      </article>
    </section>
  </div>
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
  color: var(--text-primary);
}

.hero p {
  color: var(--text-secondary);
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
  color: var(--text-primary);
}

.dashboard-card p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
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
