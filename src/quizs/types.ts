export type Option = {
  text: string;
  value: string;
  score?: number;
}

export type Question = {
  index: number;
  text: string;
  options?: Option[];
  scores?: Record<string, number>;
  target?: string;
}

export type Quiz = {
  questions: Question[];
  defaultOptions: Option[];
  // override functions
  getAnswers?: GetAnswersFunction;
  validateAnswers?: ValidateFunction;
  getResult?: GetResultFunction;
}

export type QuizMeta = {
  episode: string;
  episodeTitle: string;
  title: string;
  author: string;
  description: string;
}

export type Answers = Array<[string, string]>;
export type GetAnswersFunction = (form: HTMLFormElement | null) => Answers | null;

export type ValidateError = string;
export type ValidateResult = ValidateError | null;
export type ValidateFunction = (answers: Answers | null, quiz: Quiz) => ValidateResult;

export type GetResultFunction = (answers: Answers, quiz: Quiz) => QuizResult | null;
export type QuizResult = Record<string, string | number> & {
  score?: number;
  label?: string;
  text?: string;
  html?: string;
}