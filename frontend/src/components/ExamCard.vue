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
  width: 100%;
  border: 1px solid #dcdde1;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px; 
}

.exam-card:hover {
  border-color: #3498db;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.exam-info h2 {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.exam-info p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}


.start-exam-btn {
  width: 100%;
  text-align: center;
}
</style>