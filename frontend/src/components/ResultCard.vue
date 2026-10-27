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
        (props.result.correctAnswers / props.result.totalQuestions) * 100
    );
});

const formattedTime = computed(() => {
    const seconds = props.result.timeSpentSeconds;
    if (seconds == null) return "Okänd";

    return `${Math.floor(seconds / 60)} min ${seconds % 60} sek`;
});

const formattedDate = computed(() => {
    return new Date(props.result.completedAt).toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
});
</script>

<template>
    <article class="result-card">
        <h3>
            Högskoleprovet {{ result.semester }} {{ result.year }},
            pass {{ result.session }}
        </h3>
        <div class="result-details">
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
            <p>
                <strong>Datum:</strong>
                {{ formattedDate }}
            </p>
        </div>
    </article>
</template>

<style scoped>
.result-card {
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: white;
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
