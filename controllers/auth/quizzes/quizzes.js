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
    const { name, difficulty, categoryId, startDate, endDate, totalQuestions, questionType } = req.body;

    const { role } = req.user;

    if (role !== 'SUPER_ADMIN_USER') {
      return res.status(403).json({
        msg: 'Not authorized to access this route',
      });
    }

    const getQuiz = await fetch(
      `https://opentdb.com/api.php?amount=${totalQuestions}&category=${categoryId}&difficulty=${difficulty}&type=${questionType}`,
    );
    const questions = await getQuiz.json();

    // DO NOT NEED TO GET INCORRECT ANSWERS ONLY COMPARE GIVEN ANSWER WITH CORRECT ANSWER
    // return res.json({
    //   questions: data.results,
    // });

    // console.log(questions.results);

    await prisma.category.create({
      data: {
        id: categoryId,
        name: questions.results[0].category
      },
    });

    await prisma.quiz.create({
      data: {
        categoryId,
        name,
        type: questionType,
        difficulty,
        startDate,
        endDate,
        questions: questions.results,
      },
    });

    return res.status(201).json({
      msg: 'Quiz successfully created',
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

    if(!userID) {
      return res.status(404).json({
        msg: "No quiz found with that id",
        data: await prisma.category.findMany()
      })
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
