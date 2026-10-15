<script setup>
defineProps({
    exam: {
        type: Object,
        required: true
    }
})
</script>

<template>
  <article class="exam-card">
    <h2>Högskoleprovet {{ exam.semester }} {{ exam.year }}</h2>

    <p>Provpass {{ exam.session }}</p>

    <button>Starta prov</button>
  </article>
</template>