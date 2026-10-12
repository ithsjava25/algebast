<script setup>
defineProps({
    exam: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="exam-card">
        <h2>{{ exam.name }}</h2>
        <p>{{ exam.description }}</p>
        <p>{{ exam.year }} {{ exam.semester }}</p>
        <p>Tid: {{ exam.time_limit_minutes }} minuter</p>
        <button>Starta prov</button>
    </div>
</template>