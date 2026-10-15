<script setup>
</script>

<template>
    <main class="dashboard">
        <section class="hero">
            <h1>ALGEBÄST</h1>
            <p>Träna på högskoleprovet</p>
        </section>
        <section class="dashboard-actions">
            <article class="dashboard-card">
                <h2></h2>
                <p></p>

                <RouterLink to="/exams">
                    Välj prov
                </RouterLink>
            </article>

            <article class="dashboard-card">
                <h2>Öva</h2>
                <p>
                    Träna på XYZ, KVA, NOG och DTK genom att välja vilka
                    kategorier du vill öva på.
                </p>

                <RouterLink to="/test">
                    Börja öva
                </RouterLink>
            </article>
        </section>
    </main>
</template>