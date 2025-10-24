<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import {
  getQuestionOptions,
  getAnswers,
  validateAnswers,
  getResult,
} from './defaultMethods';

import type {
  Answers,
  Quiz,
  QuizResult,
  ValidateError,
} from './types';

const props = defineProps<{
  quiz: Quiz;
}>();

const validateMessage = ref<ValidateError | null>(null);
const quizResult = ref<QuizResult | null>(null);

const quizForm = useTemplateRef<HTMLFormElement>('quizForm');
const resultEl = useTemplateRef<HTMLDivElement>('result');

function onSubmit() {
  const getAnswersFn = props.quiz.getAnswers ?? getAnswers;
  const validateAnswersFn = props.quiz.validateAnswers ?? validateAnswers;
  const getResultFn = props.quiz.getResult ?? getResult;

  const answers = getAnswersFn(quizForm.value);
  const error = validateAnswersFn(answers, props.quiz);
  if (error) {
    // show error message
    validateMessage.value = error;
    return;
  }
  // show result
  validateMessage.value = null;
  quizResult.value = getResultFn(answers as Answers, props.quiz) ?? null;
  console.log('quizResult', answers, quizResult.value);
  nextTick(() => {
    resultEl.value?.scrollIntoView({ behavior: 'smooth' });
  });
}
</script>

<template>
  <form ref="quizForm" class="no-select">
    <ol ref="questions" class="questions">
      <li
        v-for="(question, qIndex) in quiz.questions"
        :key="qIndex"
        class="question"
      >
        <div class="question-text">{{ question.text }}</div>
        <div class="question-options">
          <label
            v-for="(option, oIndex) in getQuestionOptions(quiz, qIndex)"
            :key="oIndex"
            class="question-option"
          >
            <input
              type="radio"
              :name="`${question.index}`"
              :value="option.value"
            />
            {{ option.text }}
          </label>
        </div>
      </li>
    </ol>
    <div
      v-if="validateMessage"
      ref="message"
      class="error-message"
    >
      {{ validateMessage }}
    </div>
    <button class="submit" type="button" @click="onSubmit">送出</button>
  </form>

  <div 
    v-if="!!quizResult"
    ref="result"
    class="result"
  >
    <h2 class="result-header">測驗結果</h2>
    <slot name="result" :result="quizResult">
      <p v-if="typeof quizResult === 'string'">{{ quizResult }}</p>
      <p v-else-if="!!quizResult && 'html' in quizResult" v-html="quizResult.html"></p>
      <p v-else-if="!!quizResult && 'text' in quizResult" v-text="quizResult.text"></p>
    </slot>
  </div>
</template>

<style scoped="quiz-form">
.questions {
  padding-inline-start: 2lh;
}
.question {
  margin-bottom: 1lh;
}
.question-options {
  margin-top: 0.5lh;
}
.question-option {
  display: block;
  margin-right: 3em;
  width: max-content;
}

@media (max-width: 500px) {
  .question-option {
    display: block;
    margin-right: 0;
  }
}

.error-message {
  color: red;
  margin: 16px 0;
}

.submit {
  display: block;
  margin: 1lh auto;
  padding: 0.5em 1em;
  font-size: 1rem;
}

.result {
  margin-top: 2em;
  padding: 2em;
  border: 1px solid #ccc;
  /* display: none; */
  /* 預設隱藏 */
}

.result-header {
  margin-top: 0;
}
</style>
