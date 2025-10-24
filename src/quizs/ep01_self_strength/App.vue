<script setup lang="ts">
import QuizForm from '@/quizs/QuizForm.vue';
import { getScore as getScoreSum } from '@/quizs/defaultMethods';
import type { Answers, Quiz, QuizResult } from '@/quizs/types';

const quiz: Quiz = {
  questions: [
    { scores: { 'a': 1 }, index: 1, text: "當一個人對你不公平時，你是否讓他知道？" },
    { scores: { 'b': 1 }, index: 2, text: "你是否常常難以做決定？" },
    { scores: { 'a': 1 }, index: 3, text: "當別人佔了你的位置或妨害你的應有利益時，你是否告訴他？" },
    { scores: { 'a': 1 }, index: 4, text: "你是否經常對你的判斷有信心？" },
    { scores: { 'b': 1 }, index: 5, text: "你是否常常壓抑你的情緒，特別是負面的情緒？" },
    { scores: { 'b': 1 }, index: 6, text: "在討論或議論中你是否常常不自覺地點頭或重複別人的意見？" },
    { scores: { 'a': 1 }, index: 7, text: "通常你是否忠實表達你內心的感受？" },
    { scores: { 'a': 1 }, index: 8, text: "當你活動時如果有人注意你，你是否會感到被打擾了？" },
    { scores: { 'b': 1 }, index: 9, text: "當你和別人說話時，你是否很難注視對方的眼睛？" },
    { scores: { 'b': 1 }, index: 10, text: "你是否常難於開口表達與別人不同之意見？" },
    { scores: { 'b': 1 }, index: 11, text: "你因為很難對推銷員說「不」而買了些自己並不需要或想要的東西嗎？" },
    { scores: { 'b': 1 }, index: 12, text: "當你有充分理由退貨給店方時，你是否遲疑不決？" },
    { scores: { 'b': 1 }, index: 13, text: "在社交場合你是否覺得有困難去和人保持聊天狀態？" },
    { scores: { 'b': 1 }, index: 14, text: "你是否覺得別人在言行中好像暗示不歡迎你？" },
    { scores: { 'a': 1 }, index: 15, text: "如果有位朋友提出無理或不禮貌的要求時，你能拒絕嗎？" },
    { scores: { 'a': 1 }, index: 16, text: "如果有人暗諷你時，你知道如何回應嗎？" },
    { scores: { 'b': 1 }, index: 17, text: "當你和不友善的人談話時，你是否感到緊張而想逃離？" },
    { scores: { 'b': 1 }, index: 18, text: "當你生氣時是否指名道姓責罵對方？" },
  ],
  defaultOptions: [
    { text: "A. 通常是", value: "a" },
    { text: "B. 通常不是", value: "b" },
    { text: "C. 不知道", value: "c" },
  ],
  getResult(answers: Answers | null, quiz: Quiz): QuizResult {
    const score = getScore(answers, quiz);
    const label = getResultLabel(score);
    return { score, label };
  },
};

function getScore(answers: Answers | null, quiz: Quiz): number {
  return getScoreSum(answers ?? [], quiz);
}

function getResultLabel(score: number): string {
  if (score <= 9) {
    return '顯著的低自我強度者';
  }
  if (score >= 10 && score <= 11) {
    return '低自我強度者';
  }
  if (score >= 12 && score <= 14) {
    return '高自我強度者';
  }
  if (score >= 15) {
    return '顯著的高自我強度者';
  }
  return '(計算失敗)';
}
</script>

<template>
  <QuizForm :quiz="quiz">
    <template #result="{ result }">
      <div id="result">
        <div id="resultText">
          你屬於 <b>{{ result.label }}</b><br>
          自我強度分數：{{ result.score }}
        </div>
      </div>
    </template>
  </QuizForm>
</template>
