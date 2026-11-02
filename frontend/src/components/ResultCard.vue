<script setup>
import { computed } from "vue";

const props = defineProps({
  result: {
    type: Object,
    required: true,
  },
});

defineEmits(["select"]);

// Beräkning av procent
const percentage = computed(() => {
  if (!props.result.totalQuestions) return 0;
  return Math.round(
    (props.result.correctAnswers / props.result.totalQuestions) * 100
  );
});

// Formatera tid
const formattedTime = computed(() => {
  const seconds = props.result.timeSpentSeconds;
  if (seconds == null) return "Okänd";
  return `${Math.floor(seconds / 60)} min ${seconds % 60} sek`;
});

// Beräkna starttid (från main)
const startedAt = computed(() => {
  const { completedAt, timeSpentSeconds } = props.result;
  if (!completedAt || timeSpentSeconds == null) return null;
  return new Date(new Date(completedAt).getTime() - timeSpentSeconds * 1000);
});

// Formaterad tidsstämpel som rubrik (från main)
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
  <article class="result-card" @click="$emit('select', result.attemptId)">
    <h3>
      {{ formattedTimestamp }}
    </h3>
    <div class="result-details">
      <p>
        <strong>Prov:</strong>
        Högskoleprovet {{ result.semester }} {{ result.year }}, pass
        {{ result.session }}
      </p>
      <p>
        <strong>Resultat:</strong>
        {{ result.correctAnswers }} / {{ result.totalQuestions }} rätt
      </p>
      <p>
        <strong>Procent:</strong>
        {{ percentage }}%
      </p>
      <p>
        <strong>Tid:</strong>
        {{ formattedTime }}
      </p>
    </div>

    <div class="card-footer">
      <span class="action-link">Visa detaljer &rarr;</span>
    </div>
  </article>
</template>

<style scoped>
.result-card {
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-color, #3498db);
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

.card-footer {
  border-top: 1px solid var(--border-color);
  margin-top: 16px;
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.action-link {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent-color);
}
</style>