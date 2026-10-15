<script setup>
import { onMounted } from "vue";
import { getRandomQuestionsByCategories } from "@/services/questionService.js";

onMounted(async () => {
  try {
    const questions = await getRandomQuestionsByCategories(["KVA", "NOG"], 10);
    console.log("Questions:", questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
});
</script>

<template>
  <h1>Testvyn fungerar!</h1>
</template>
