/**
 * @description Reusable function to check dates for when attempting to join and answer a quiz
 * @file dateComparison.js
 *
 * @author Deacon Smith
 * @created 15-11-2023
 * @updated 15-11-2023
 */

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

  return {
    status: quizDates.QUIZ_DATE_CHECK.ongoing,
    msg: 'Quiz is currently ongoing',
  };
};

export default checkQuizDates;
