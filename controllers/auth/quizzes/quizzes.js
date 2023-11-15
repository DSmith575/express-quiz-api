/**
 * @description CRUD functionality for quizzes.
 * @file quizzes.js
 *
 * @function createQuiz Creates a quiz
 * @function deleteQuiz Deletes a quiz by id
 * @function getQuiz Gets quiz information by id
 * @function getAllQuizzes Get a list of all quizzes
 * @function getPastQuizzes Get a list of all past quizzes where endDate is less than current date
 * @function getPresentQuizzes Get a list of all present quizzes where startDate is equal to, and endDate is greater than current date
 * @function getFutureQuizzes Get a list of all future quizzes where startDate is greater than current date
 *
 * @author Deacon Smith
 * @created 06-11-2023
 * @updated 15-11-2023
 */

import { PrismaClient } from '@prisma/client';
import quizConsonants from '../../../utils/consonants/globalConsonants.js';
import { quizCreate } from '../../../utils/axios/instance.js';
import statCodes from '../../../utils/statusCodes/statusCode.js';
import getCurrentDate from '../../../utils/dateTime/currentDate.js';

const prisma = new PrismaClient();

const createQuiz = async (req, res) => {
  try {
    const { name, difficulty, categoryId, startDate, endDate, totalQuestions, type } = req.body;

    const { role } = req.user;

    if (role !== quizConsonants.USER_ROLES.super) {
      return res.status(statCodes.FORBIDDEN).json({
        statusCode: res.statusCode,
        msg: 'Not authorized to access this route',
      });
    }

    // Check if the quiz name already exists
    const checkQuizNames = await prisma.quiz.findFirst({
      where: { name: String(name) },
    });

    if (checkQuizNames) {
      return res.status(statCodes.CONFLICT).json({
        statusCode: res.statusCode,
        msg: 'Quiz name already exists',
      });
    }

    const getQuiz = await quizCreate.get('api.php?', {
      params: {
        amount: totalQuestions,
        category: categoryId,
        difficulty: difficulty,
        type: type,
      },
    });

    const questions = await getQuiz.data;

    // Check the returned response_code value
    if (questions.response_code === 1) {
      return res.status(statCodes.BAD_REQUEST).json({
        statusCode: res.statusCode,
        msg: 'Quiz category does not contain any questions for this type',
        error: 'Some data is missing or empty',
      });
    }

    // Before creating a new category, checks already made categories and creates from the fields if does not exist
    const findQuizID = await prisma.category.findFirst({
      where: { id: Number(categoryId) },
    });

    if (!findQuizID) {
      await prisma.category.create({
        data: {
          id: categoryId,
          name: questions.results[0].category,
        },
      });
    }

    // When creating the quiz we are also creating the questions model at the same time
    // using the set syntax we can pass the incorrect answers to the String[]
    const quizCreation = await prisma.quiz.create({
      data: {
        name,
        categoryId,
        type,
        difficulty,
        startDate,
        endDate,
        questions: {
          create: questions.results.map((question) => ({
            question: question.question,
            correctAnswer: question.correct_answer,
            incorrectAnswers: { set: question.incorrect_answers },
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return res.status(statCodes.CREATED).json({
      statusCode: res.statusCode,
      msg: 'Quiz successfully created',
      data: quizCreation,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quizId = await prisma.quiz.findUnique({
      where: { id: Number(req.params.id) },
    });

    const { role } = req.user;

    if (role !== quizConsonants.USER_ROLES.super) {
      return res.status(statCodes.FORBIDDEN).json({
        statusCode: res.statusCode,
        msg: 'You are not authorized to access this route',
      });
    }

    if (!quizId) {
      return res.status(statCodes.NOT_FOUND).json({
        statusCode: res.statusCode,
        msg: `No quiz with the id ${req.params.id} exists`,
      });
    }

    await prisma.quiz.delete({
      where: { id: Number(req.params.id) },
    });

    return res.status(statCodes.NO_CONTENT).json({
      statusCode: res.statusCode,
      msg: `Quiz with the id ${req.params.id} successfully deleted`,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const getQuiz = async (req, res) => {
  try {
    const findQuiz = await prisma.quiz.findFirst({
      where: { id: Number(req.params.id) },
      include: {
        userQuizScores: true,
        questions: {
          where: { quizId: Number(req.params.id) },
        },
      },
    });

    if (!findQuiz) {
      return res.status(statCodes.NOT_FOUND).json({
        statusCode: res.statusCode,
        msg: `No quiz with the id ${req.params.id} found`,
      });
    }

    const totalQuestions = findQuiz.questions.length;

    // Map the questions and get the correct and incorrect answers
    const quizQuestions = findQuiz.questions.map((question) => ({
      correctAnswer: question.correctAnswer,
      incorrectAnswers: question.incorrectAnswers,
    }));

    // Using reduce to get the total number of each users score
    // Then getting the average with the userAverage / the length of the userQuiz scores
    // Using floor and using the average / totalQuestions * the calculated average const (100)

    let allUserAverageScore;

    if (!findQuiz.userQuizScores) {
      const getUserAverage = findQuiz.userQuizScores.reduce((cur, val) => cur + val.score, 0);
      const averageScore = getUserAverage / findQuiz.userQuizScores.length;
      allUserAverageScore = `${Math.floor((averageScore / totalQuestions) * quizConsonants.QUIZ_AVERAGE.calculate)}%`;
    }
    // get a list of userIds and their score for the quiz
    const getAllUserScores = findQuiz.userQuizScores.map((score) => ({
      userId: score.userId,
      score: score.score,
    }));

    // Get the overall winner of the quiz sorting scores from highest to lowest
    const getHighestScore = getAllUserScores.sort((a, b) => b.score - a.score);
    let getHighestScoreUsername;

    // using the userId from get highest score to return the username for overall winner
    if (getHighestScore.length > 0 && getHighestScore[0].userId) {
      getHighestScoreUsername = await prisma.user.findFirst({
        where: { id: Number(getHighestScore[0].userId) },
      });
      getHighestScoreUsername = getHighestScoreUsername.username;
    }

    // Custom return object just for displaying information in a certain order
    const quizInformation = {
      id: findQuiz.id,
      name: findQuiz.name,
      categoryId: findQuiz.categoryId,
      type: findQuiz.type,
      difficulty: findQuiz.difficulty,
      startDate: findQuiz.startDate,
      endDate: findQuiz.endDate,
      totalQuestions,
      allUserAverageScore,
      overallWinner: getHighestScoreUsername,
      quizQuestions,
      scores: findQuiz.userQuizScores,
    };

    return res.status(statCodes.OK).json({
      statusCode: res.statusCode,
      quizInformation,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const getAllQuiz = await prisma.quiz.findMany({});

    if (getAllQuiz.length === 0) {
      return res.status(statCodes.NOT_FOUND).json({
        statusCode: res.statusCode,
        msg: `No Quizzes found`,
      });
    }

    return res.status(statCodes.OK).json({
      data: getAllQuiz,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const getPastQuizzes = async (req, res) => {
  try {
    const currentDate = getCurrentDate();

    const pastQuiz = await prisma.quiz.findMany({
      where: {
        endDate: {
          lt: currentDate,
        },
      },
    });

    if (pastQuiz.length === 0) {
      return res.status(statCodes.NOT_FOUND).json({
        statusCode: res.statusCode,
        msg: `No past quizzes found`,
      });
    }

    return res.status(statCodes.OK).json({
      statusCode: res.statusCode,
      data: pastQuiz,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      msg: error.message,
    });
  }
};

const getPresentQuizzes = async (req, res) => {
  try {
    const currentDate = getCurrentDate();

    const presentQuiz = await prisma.quiz.findMany({
      where: {
        startDate: {
          equals: currentDate,
        },
        endDate: {
          gte: currentDate,
        },
      },
    });

    if (presentQuiz.length === 0) {
      return res.status(statCodes.NOT_FOUND).json({
        statusCode: res.statusCode,
        msg: `No present quizzes found`,
      });
    }

    return res.status(statCodes.OK).json({
      statusCode: res.statusCode,
      data: presentQuiz,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const getFutureQuizzes = async (req, res) => {
  try {
    const currentDate = getCurrentDate();

    const futureQuiz = await prisma.quiz.findMany({
      where: {
        startDate: {
          gt: currentDate,
        },
      },
    });

    if (futureQuiz.length === 0) {
      return res.status(statCodes.NOT_FOUND).json({
        statusCode: res.statusCode,
        msg: `No future quizzes found`,
      });
    }

    return res.status(statCodes.OK).json({
      statusCode: res.statusCode,
      data: futureQuiz,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

export { createQuiz, deleteQuiz, getQuiz, getAllQuizzes, getPastQuizzes, getPresentQuizzes, getFutureQuizzes };
