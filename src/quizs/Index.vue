<script setup lang="ts">
const props = defineProps<{
  quizs: Array<{
    key: string;
    title: string;
    link: string;
    episode: string;
    episodeTitle?: string;
  }>;
}>();
</script>

<template>
  <h1 class="title no-select">心理測驗量表</h1>
  <div class="quiz-container">
    <a
      v-for="quiz in props.quizs"
      :key="quiz.key"
      :href="quiz.link"
      class="quiz"
    >
      <div class="quiz-title">{{ quiz.title }}</div>
      <div class="quiz-desc">{{ quiz.episode }} {{ quiz.episodeTitle ?? '' }}</div>
    </a>
  </div>
</template>

<style scoped type="scss">
.quiz-container {
  margin: 16px;
}
.quiz {
  display: block;
  margin: 16px;
  padding: 16px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #000;
  text-decoration: none;
}

.quiz:hover {
  background-color: #f9f9f9;
}

.quiz-desc {
  color: #999;
  font-size: 0.7em;
}
</style>
