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
  <article class="exam-card card">
    <div class="exam-info">
      <h2>Högskoleprovet {{ exam.semester }} {{ exam.year }}</h2>
      <p>Provpass {{ exam.session }}</p>
    </div>

    <button class="nav-btn primary start-exam-btn" @click="emit('start-exam', exam.id)">
      Starta prov
    </button>
  </article>
</template>

<style scoped>
.exam-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px; 
}


.exam-info h2 {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.exam-info p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}


.start-exam-btn {
  width: 100%;
  text-align: center;
}
</style>