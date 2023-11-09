import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const createQuiz = async (req, res) => {
  try {
    const { name, difficulty, categoryId, startDate, endDate, totalQuestions, type } = req.body;

    const { role } = req.user;

    if (role !== 'SUPER_ADMIN_USER') {
      return res.status(403).json({
        statusCode: res.statusCode,
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
      return res.status(409).json({
        statusCode: res.statusCode,
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

    return res.status(201).json({
      statusCode: res.statusCode,
      msg: 'Quiz successfully created',
      data: quizCreation,
    });
  } catch (error) {
    return res.status(500).json({
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

    if (role !== 'SUPER_ADMIN_USER') {
      return res.status(403).json({
        statusCode: res.statusCode,
        msg: 'You are not authorized to access this route',
      });
    }

    if (!quizId) {
      return res.status(404).json({
        statusCode: res.statusCode,
        msg: `No quiz with the id ${req.params.id} exists`,
      });
    }

    await prisma.quiz.delete({
      where: { id: Number(req.params.id) },
    });

    return res.status(200).json({
      statusCode: res.statusCode,
      msg: `Quiz with the id ${req.params.id} successfully deleted`,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const getQuiz = async (req, res) => {
  try {
    const findQuiz = await prisma.quiz.findFirst({
      where: { id: Number(req.params.id) },
    });

    if (!findQuiz) {
      return res.status(404).json({
        statusCode: res.statusCode,
        msg: `No quiz with the id ${req.params.id} found`,
      });
    }

    return res.status(200).json({
      statusCode: res.statusCode,
      data: findQuiz,
    });

    // const userId = await prisma.quiz.findFirst({
    //   where: {id: Number(req.params.id)},
    //   include: {
    //     questions: true,
    //   }
    // })
  } catch (error) {
    return res.status(500).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const getAllQuiz = await prisma.quiz.findMany({});

    if (getAllQuiz.length === 0) {
      return res.status(404).json({
        statusCode: res.statusCode,
        msg: `No Quizzes found`,
      });
    }

    return res.status(200).json({
      data: getAllQuiz,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const getPastQuizzes = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

    const pastQuiz = await prisma.quiz.findMany({
      where: {
        endDate: {
          lt: currentDate,
        },
      },
    });

    if (pastQuiz.length === 0) {
      return res.status(404).json({
        statusCode: res.statusCode,
        msg: `No past quizzes found`,
      });
    }

    return res.status(200).json({
      statusCode: res.statusCode,
      data: pastQuiz,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

const getPresentQuizzes = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

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
      return res.status(404).json({
        statusCode: res.statusCode,
        msg: `No present quizzes found`,
      });
    }

    return res.status(200).json({
      statusCode: res.statusCode,
      data: presentQuiz,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const getFutureQuizzes = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

    const futureQuiz = await prisma.quiz.findMany({
      where: {
        startDate: {
          gt: currentDate,
        },
      },
    });

    if (futureQuiz.length === 0) {
      return res.status(404).json({
        statusCode: res.statusCode,
        msg: `No future quizzes found`,
      });
    }

    return res.status(200).json({
      statusCode: res.statusCode,
      data: futureQuiz,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

export { createQuiz, deleteQuiz, getQuiz, getAllQuizzes, getPastQuizzes, getPresentQuizzes, getFutureQuizzes };
