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
        dina framsteg.
      </p>
      Kom igång direkt med en <RouterLink to="/exercises">övning</RouterLink>,
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
        Högskoleprovet är ett frivilligt prov som ger dig ytterligare en
        möjlighet att konkurrera om platser på universitet och högskolor. Provet
        består av en verbal del, som prövar bland annat ordförståelse och
        läsförståelse på svenska och engelska, och en kvantitativ del, som
        prövar matematisk problemlösning, logiskt resonemang och tolkning av
        diagram och tabeller. Resultatet kan användas vid antagning till högre
        utbildning och kompletterar dina gymnasiebetyg genom att ge dig en
        ytterligare urvalsgrupp.
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
</style>
