const QUIZ_NAME = {
  min: 5,
  max: 30,
  pattern: /^[A-Za-z]+$/,
};

const QUIZ_QUESTIONS = {
  required: 10,
};

const CATEGORY_TYPES = {
  easy: "easy",
  medium: "medium",
  hard: "hard"
};

const CATEGORY_ID = {
  min: 1,
  max: 32
}



export default { QUIZ_NAME, QUIZ_QUESTIONS, CATEGORY_TYPES, CATEGORY_ID };
