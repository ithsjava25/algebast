<script setup>
import { computed } from "vue";

const props = defineProps({
  result: {
    type: Object,
    required: true,
  },
});

const percentage = computed(() => {
  if (!props.result.totalQuestions) return 0;

  return Math.round(
    (props.result.correctAnswers / props.result.totalQuestions) * 100,
  );
});

const formattedTime = computed(() => {
  const seconds = props.result.timeSpentSeconds;
  if (seconds == null) return "Okänd";

  return `${Math.floor(seconds / 60)} min ${seconds % 60} sek`;
});

const startedAt = computed(() => {
  const { completedAt, timeSpentSeconds } = props.result;
  if (!completedAt || timeSpentSeconds == null) return null;

  return new Date(new Date(completedAt).getTime() - timeSpentSeconds * 1000);
});

const formattedTimestamp = computed(() => {
  if (!startedAt.value) return "Okänd";

  const date = startedAt.value.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = startedAt.value.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date} kl ${time}`;
});
</script>

<template>
  <article class="result-card">
    <h3>
      {{ formattedTimestamp }}
    </h3>
    <div class="result-details">
      <p>
        <strong>Prov:</strong>
        {{ result.semester }} {{ result.year }}, pass
        {{ result.session }}
      </p>
      <p>
        <strong>Resultat:</strong>
        {{ result.correctAnswers }} / {{ result.totalQuestions }} rätt
      </p>
      <p>
        <strong>Tid:</strong>
        {{ formattedTime }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.result-card {
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
}

.result-card h3 {
  margin: 0 0 20px;
  font-size: 18px;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-details p {
  margin: 0;
  font-size: 14px;
}
</style>
