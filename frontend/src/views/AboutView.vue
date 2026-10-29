<template>
  <section class="about-view">
    <header class="about-hero">
      <h1>Om AlgeBäst</h1>
      <p class="subtitle">Öva matematik inför högskoleprovet.</p>
    </header>

    <section class="about-section">
      <h2>Vad är AlgeBäst?</h2>
      <p>
        AlgeBäst hjälper dig att öva matematik inför högskoleprovet och följa
        dina framsteg. Kom igång direkt med en
        <RouterLink to="/exercises">övning</RouterLink>, eller gör ett helt
        <RouterLink to="/exams">prov</RouterLink> för att se hur du ligger till!
      </p>

      <div class="link-section">
        <p>Vill du spara dina resultat och följa dina framsteg över tid?</p>

        <RouterLink to="/auth?mode=register" class="link-button">
          Skapa ett konto
        </RouterLink>
      </div>
    </section>

    <section class="about-section">
      <h2>Högskoleprovet</h2>
      <p>
        Högskoleprovet är ett frivilligt prov som ger dig ytterligare en
        möjlighet att konkurrera om platser på universitet och högskolor. Provet
        består av en verbal del, som prövar bland annat ordförståelse och
        läsförståelse på svenska och engelska, och en kvantitativ del, som
        prövar matematisk problemlösning, logiskt resonemang och tolkning av
        diagram och tabeller. Resultatet kan användas vid antagning till högre
        utbildning och kompletterar dina gymnasiebetyg genom att ge dig en
        ytterligare urvalsgrupp.
      </p>

      <div class="link-section">
        <a
          href="https://www.uhr.se/studier-och-antagning/Hogskoleprovet/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Läs mer hos UHR
        </a>
        <a
          href="https://www.hogskoleprov.nu"
          target="_blank"
          rel="noopener noreferrer"
          class="link-button"
        >
          Anmäl dig till högskoleprovet
        </a>
      </div>
    </section>
  </section>
</template>

<style scoped>
.about-view {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.link-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-top: 24px;
}

.link-section p {
  margin: 0;
}

.link-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
  font-family: "Space Mono", monospace;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.link-button:hover {
  opacity: 0.85;
}

.link-button:focus-visible {
  outline: 2px solid var(--text-primary);
  outline-offset: 3px;
}
</style>
