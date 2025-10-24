<script setup lang="ts">
import QuizForm from '@/quizs/QuizForm.vue';
import { getScoreAverage } from '@/quizs/defaultMethods';
import type { Answers, Quiz, QuizResult } from '@/quizs/types';

// quiz content
const positive = { a: 1, b: 2, c: 3, d: 4, e: 5 } as Record<string, number>;
const negative = { a: 5, b: 4, c: 3, d: 2, e: 1 } as Record<string, number>;

const quiz: Quiz = {
  questions: [
    { scores: positive, index: 1, text: "我覺得我的身材很性感。" },
    { scores: positive, index: 2, text: "我喜歡自己這個樣子的長相。" },
    { scores: positive, index: 3, text: "我覺得大多數人都認為我長得很美、很帥。" },
    { scores: positive, index: 4, text: "我喜歡自己沒穿衣服時的樣子。" },
    { scores: positive, index: 5, text: "我喜歡穿合身的衣服。" },
    { scores: negative, index: 6, text: "我不喜歡自己的身材。" },
    { scores: negative, index: 7, text: "我覺得我的身材不吸引人。" }
  ],
  defaultOptions: [
    { text: '非常不同意', value: 'a' },
    { text: '不同意', value: 'b' },
    { text: '中立意見', value: 'c' },
    { text: '同意', value: 'd' },
    { text: '非常同意', value: 'e' }
  ],
  getResult(answers: Answers): QuizResult {
    const score = getScoreAverage(answers, quiz);
    let label = '';
    if (score < 3.1) {
      label = '身體意象較負面，對自己外表較不滿意';
    } else if (score >= 3.1 && score <= 3.9) {
      label = '身體意象中等，對自己外表尚可';
    } else if (score >= 4) {
      label = '身體意象較佳，對自己外表滿意';
    }
    return {
      score,
      label,
    };
  },
};
</script>

<template>
  <QuizForm :quiz="quiz">
    <template #result="{ result }">
      <div id="result">
        <div id="resultText">
          分數：{{ result.score?.toFixed(1) }}<br />
          顯示<b>{{ result.label }}</b>
        </div>
      </div>
    </template>
  </QuizForm>
</template>
