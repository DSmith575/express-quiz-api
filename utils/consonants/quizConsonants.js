const QUIZ_NAME = {
  min: 5,
  max: 30,
  pattern: /^[A-Za-z]+$/,
};

const QUIZ_QUESTIONS = {
  required: 10,
};

const CATEGORY_DIFFICULTY = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
};

const QUIZ_DATES = {
  addFive: 5,
  format: 'YYYY-MM-DD',
};

const CATEGORIES_MIN_MAX = {
  min: 9,
  max: 32,
};

const QUIZ_TYPE = {
  multiple: 'multiple',
  boolean: 'boolean',
};

// Taken from https://opentdb.com/api_category.php
const CATEGORIES_ID = [
  {
    id: 9,
    name: 'General Knowledge',
  },
  {
    id: 10,
    name: 'Entertainment: Books',
  },
  {
    id: 11,
    name: 'Entertainment: Film',
  },
  {
    id: 12,
    name: 'Entertainment: Music',
  },
  {
    id: 13,
    name: 'Entertainment: Musicals & Theatres',
  },
  {
    id: 14,
    name: 'Entertainment: Television',
  },
  {
    id: 15,
    name: 'Entertainment: Video Games',
  },
  {
    id: 16,
    name: 'Entertainment: Board Games',
  },
  {
    id: 17,
    name: 'Science & Nature',
  },
  {
    id: 18,
    name: 'Science: Computers',
  },
  {
    id: 19,
    name: 'Science: Mathematics',
  },
  {
    id: 20,
    name: 'Mythology',
  },
  {
    id: 21,
    name: 'Sports',
  },
  {
    id: 22,
    name: 'Geography',
  },
  {
    id: 23,
    name: 'History',
  },
  {
    id: 24,
    name: 'Politics',
  },
  {
    id: 25,
    name: 'Art',
  },
  {
    id: 26,
    name: 'Celebrities',
  },
  {
    id: 27,
    name: 'Animals',
  },
  {
    id: 28,
    name: 'Vehicles',
  },
  {
    id: 29,
    name: 'Entertainment: Comics',
  },
  {
    id: 30,
    name: 'Science: Gadgets',
  },
  {
    id: 31,
    name: 'Entertainment: Japanese Anime & Manga',
  },
  {
    id: 32,
    name: 'Entertainment: Cartoon & Animations',
  },
];

export default { QUIZ_NAME, QUIZ_QUESTIONS, CATEGORY_DIFFICULTY, CATEGORIES_ID, CATEGORIES_MIN_MAX, QUIZ_TYPE, QUIZ_DATES };
