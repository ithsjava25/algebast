<script setup>
import { onMounted } from 'vue'
import { getQuestions } from '@/services/questionService.js'

onMounted(async () => {
    try {
        const questions = await getQuestions(["KVA", "NOG"], 10);
        console.log("Questions:", questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
});
</script>