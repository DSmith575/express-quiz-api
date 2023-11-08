import { PrismaClient } from '@prisma/client';
import axios from 'axios';

/**
 *       statusCode: res.statusCode,
 *       statusCode: res.statusCode,
 *       statusCode: res.statusCode,
 *       statusCode: res.statusCode,
 *       statusCode: res.statusCode,
 *       statusCode: res.statusCode,
 *       statusCode: res.statusCode,
 *       statusCode: res.statusCode,
 *       statusCode: res.statusCode,
 *       statusCode: res.statusCode,
 *       statusCode: res.statusCode,
 *       statusCode: res.statusCode,
 *       statusCode: res.statusCode,
 *
 *
 *      CHANGE EMAIL TO COMPARE USERNAME
 */
const prisma = new PrismaClient();

const createQuiz = async (req, res) => {
  try {
    const { name, difficulty, categoryId, startDate, endDate, totalQuestions, type } = req.body;

    const { role } = req.user;

    if (role !== 'SUPER_ADMIN_USER') {
      return res.status(403).json({
        msg: 'Not authorized to access this route',
      });
    }

    // const test = await prisma.category.findMany({
    //   where: {
    //     id: 9
    //   },
    //   include: {
    //     quizzes: true,
    //   }
    // });
    // return res.json({
    //   data: test
    // })
    const checkQuizNames = await prisma.quiz.findFirst({
      where: { name: String(name) },
    });

    if (checkQuizNames) {
      return res.json({
        msg: 'Quiz name already exists',
      });
    }

    const getQuiz = await fetch(
      `https://opentdb.com/api.php?amount=${totalQuestions}&category=${categoryId}&difficulty=${difficulty}&type=${type}`,
    );
    const questions = await getQuiz.json();

    if (questions.response_code === 1) {
      return res.status(400).json({
        statusCode: res.statusCode,
        msg: 'Quiz category does not contain any questions for this type',
        error: 'Some data is missing or empty',
      });
    }

    // DO NOT NEED TO GET INCORRECT ANSWERS ONLY COMPARE GIVEN ANSWER WITH CORRECT ANSWER
    // return res.json({
    //   questions: data.results,
    // });

    // console.log(questions.results);

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
    // return res.status(404).json({
    //   msg: `Quiz with the id ${findQuizID.id} already exists`,
    //   data: await prisma.category.findMany({}),
    // });

    // return res.json({
    //   msg: questions.results.map((value, index) => {
    //     console.log(`Category: ${value.category}`);
    //     console.log(`Type: ${value.type}`);
    //     console.log(`Difficulty: ${value.difficulty}`);
    //     console.log(`Question: ${value.question}`);
    //     console.log(`Correct Answer: ${value.correct_answer}`);
    //     console.log(`Incorrect Answers: ${typeof value.incorrect_answers.join("," )}`);
    //     console.log(''); // Add an empty line for separation
    //   })
    // })

    // return res.json({
    //   questionTest
    // })

    const quizCreation = await prisma.quiz.create({
      data: {
        name,
        categoryId,
        name,
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

    return res.status(201).json({
      msg: 'Quiz successfully created',
      data: quizCreation,
    });

    // return res.json({
    //   msg: name,
    //   difficulty,
    //   categoryId,
    //   startDate,
    //   endDate,
    //   totalQuestions,
    //   questionType,
    //   questions: data.results
    // });
  } catch (error) {
    return res.status(500).json({
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

    if (role !== 'SUPER_ADMIN_USER') {
      return res.status(403).json({
        msg: 'You are not authorized to access this route',
      });
    }

    if (!quizId) {
      return res.status(404).json({
        msg: `No quiz with the id ${req.params.id} exists`,
      });
    }

    return res.json({
      msg: 'hello',
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

// Check categories
// if id and name don't exist, create them, else pass a list of categories that are already made to use.

const getQuiz = async (req, res) => {
  try {
    const userID = await prisma.category.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!userID) {
      return res.status(404).json({
        msg: 'No quiz found with that id',
        data: await prisma.category.findMany(),
      });
    }

    return res.json({
      data: userID,
    });
  } catch (error) {
    return res.status(500).json({
      msg: 'No Quiz found',
    });
  }
};

export { createQuiz, deleteQuiz, getQuiz };
