<script setup>
defineProps({
  exam: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["start-exam"]);
</script>

<template>
  <article class="exam-card">
    <h2>Högskoleprovet {{ exam.semester }} {{ exam.year }}</h2>
    <p>Provpass {{ exam.session }}</p>

    <button @click="emit('start-exam', exam.id)">Starta prov</button>
  </article>
</template>
