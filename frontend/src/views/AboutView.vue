<template>
  <main class="about-view">
    <header class="about-hero">
      <h1>Om AlgeBäst</h1>
      <p class="subtitle">Öva matematik inför högskoleprovet.</p>
    </header>

    <section class="about-section">
      <h2>Vad är AlgeBäst?</h2>
      <p>
        AlgeBäst hjälper dig att öva matematik inför högskoleprovet och följa
        dina framsteg.
      </p>
      Kom igång direkt med <RouterLink to="/exercises">övningarna</RouterLink>,
      eller gör ett helt <RouterLink to="/exams">prov</RouterLink> för att se
      hur du ligger till.

      <p>
        <RouterLink to="/auth">Skapa ett konto</RouterLink> redan nu för att
        spara dina resultat och följa dina framsteg!
      </p>
    </section>

    <section class="about-section">
      <h2>Högskoleprovet</h2>
      <p>
        Högskoleprovet är en nationell examination som används för att bedöma
        studenters kunskaper i matematik, engelska och svenska. Högskoleprovet
        mäter färdigheter som har betydelse för förmågan att klara av
        högskolestudier.
      </p>

      <div>
        <a
          href="https://www.uhr.se/studier-och-antagning/Hogskoleprovet/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Läs mer hos UHR
        </a>
      </div>

      <div>
        <a
          href="https://www.hogskoleprov.nu"
          target="_blank"
          rel="noopener noreferrer"
        >
          Anmäl dig till högskoleprovet här
        </a>
      </div>
    </section>
  </main>
</template>

<style scoped>
.about-view {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
