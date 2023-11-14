import getCurrentDate from './currentDate.js';
import quizDates from '../consonants/globalConsonants.js';

const checkQuizDates = (startDate, endDate) => {
  const currentDate = getCurrentDate();

  if (startDate > currentDate) {
    return {
      status: quizDates.QUIZ_DATE_CHECK.notStarted,
      msg: 'Quiz has not started',
    };
  }

  if (endDate < currentDate) {
    return {
      status: quizDates.QUIZ_DATE_CHECK.ended,
      msg: 'Quiz has already ended',
    };
  }
};

export default checkQuizDates;
