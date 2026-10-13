<script setup>
import { ref, onMounted } from 'vue'
import ExamCard from '@/components/ExamCard.vue'
import { getExams } from '@/services/examService.js'


const exams = ref([])

onMounted(async () => {
    exams.value = await getExams()
})
</script>

<template>
    <main>
        <h1>Välj prov</h1>
        <ExamCard
            v-for="exam in exams"
            :key="exam.id"
            :exam="exam"
        />
    </main>
</template>