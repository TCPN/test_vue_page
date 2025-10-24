<script setup lang="ts">
import QuizForm from '@/quizs/QuizForm.vue';
import ChartPlane from '@/components/ChartPlane.vue';
import type { Answers, Quiz, QuizResult } from '@/quizs/types';

const quiz: Quiz = {
  questions: [
    { target: 'axisY', index: 1, text: "你會沒有明顯的理由而有時覺得快樂，有時又覺得沮喪嗎？" },
    { target: 'axisY', index: 2, text: "不管有沒有明顯的原因，你的心境經常起伏不定嗎？" },
    { target: 'axisY', index: 3, text: "你有喜怒無常的傾向嗎？" },
    { target: 'axisY', index: 4, text: "在你想集中注意力時，常神不守舍嗎？" },
    { target: 'axisY', index: 5, text: "即使在你必須與人交談時，你也常「失常」嗎？" },
    { target: 'axisY', index: 6, text: "你會時而充滿活力，時而又了無生氣嗎？" },
    { target: 'axisX', index: 7, text: "你較喜歡行動，而不喜策劃行動嗎？" },
    { target: 'axisX', index: 8, text: "當你參與需要快速行動的工作時，是否最感快樂？" },
    { target: 'axisX', index: 9, text: "你通常會主動去結交新朋友嗎？" },
    { target: 'axisX', index: 10, text: "你有要求自己行動迅速、確實的傾向嗎？" },
    { target: 'axisX', index: 11, text: "自認為是個活潑的嗎？" },
    { target: 'axisX', index: 12, text: "如果你被禁止從事很多社交接觸，是否會覺得很不快樂？" },
  ],
  defaultOptions: [
    { text: "O", value: "o", score: 1 },
    { text: "X", value: "x", score: -1 },
  ],
  getResult,
};

// quiz logics

function getScores(answers: Answers, quiz: Quiz): { axisX: number; axisY: number } {
  let scores = { axisX: 0, axisY: 0 };
  for (let [key, value] of answers) {
    const question = quiz.questions.find(q => q.index === Number(key));
    if (!question) continue;
    const target = question.target as 'axisX' | 'axisY';
    const option = quiz.defaultOptions.find(opt => opt.value === value);
    if (!option) continue;
    const score = option.score;
    scores[target] += score as number;
  }
  return scores;
}

function getResults(scores: { axisX: number; axisY: number }): { label: string; description: string; animal: string } {
  const axisXText = scores.axisX > 0 ? 'x+' : 'x-'; // 外向性
  const axisYText = scores.axisY > 0 ? 'y+' : 'y-'; // 情緒不穩定性
  const resultsMap = {
    'x+y+': { label: '暴躁性格', quadrant: '第一象限', description: '外向、情緒不穩定，容易焦慮與急躁。', animal: '公牛' },
    'x-y+': { label: '憂鬱性格', quadrant: '第二象限', description: '內向、情緒不穩定，容易憂慮與悲觀。', animal: '貓' },
    'x-y-': { label: '冷漠性格', quadrant: '第三象限', description: '內向、情緒穩定，冷靜、不易受干擾。', animal: '烏龜' },
    'x+y-': { label: '熱情性格', quadrant: '第四象限', description: '外向、情緒穩定，活潑、積極、喜歡社交。', animal: '猴子' },
  };
  return resultsMap[`${axisXText}${axisYText}`];
}

function getResult(answers: Answers, quiz: Quiz): QuizResult {
  const scores = getScores(answers, quiz);
  const results = getResults(scores);
  return { ...results, ...scores };
}
function scoreString(v: number | string | undefined) {
  return (typeof v === 'number' && v >= 0) ? '+' + v : '' + v;
}

const chartOptions = window.innerWidth < 600 ? {
  width: 500,
  height: 500,
  showGrid: false,
} : {};
</script>

<template>
  <QuizForm :quiz="quiz">
    <template #result="{ result }">
      <h4>
        你的性格傾向：<b>{{ result.label }}</b>
      </h4>
      <p>
        {{ result.description }}<br>
        代表動物：{{ result.animal }}
      </p>
      <p>
        外向性 (Extroversion)：{{ scoreString(result.axisX) }}<br/>
        神經質 (Neuroticism)：{{ scoreString(result.axisY) }}
      </p>
      <ChartPlane
        :points="[{ x: result.axisX as number, y: result.axisY as number, fill: '#f00', size: 10 }]"
        :opts="chartOptions"
      />
    </template>
  </QuizForm>
</template>
