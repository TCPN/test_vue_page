import type {
  Quiz,
  Answers,
  ValidateError,
  QuizResult,
} from './types';

export function getQuestionOptions(quiz: Quiz, index: number) {
  const question = quiz.questions[index];
  if (!question) {
    return [];
  }
  return (question.options ?? quiz.defaultOptions ?? []);
}

export function getAnswers(form: HTMLFormElement | null = null): Answers | null {
  if (!form) { return null; }
  const formData = new FormData(form);
  return Array.from(formData.entries()) as Answers;
}

export function validateAnswers(answers: Answers | null, quiz: Quiz): ValidateError | null {
  if (!answers || answers.length < quiz.questions.length) {
    return '尚有題目未作答';
  }
  return null;
}

export function getScore(answers: Answers | null, quiz: Quiz): number {
  let score = 0;
  for (let [key, value] of answers ?? []) {
    const question = quiz.questions.find(q => q.index === Number(key));
    if (question?.scores) {
      score += (question.scores[value] ?? 0);
      continue;
    }
    const options = getQuestionOptions(quiz, Number(key));
    const option = options.find(o => o.value === value);
    if (option) {
      score += option.score ?? 0;
      continue;
    }
  }
  return score;
}

export function getResult(answers: Answers, quiz: Quiz): QuizResult | null {
  const score = getScore(answers, quiz);
  return { score, text: `你的總分是 ${score} 分` };
}
