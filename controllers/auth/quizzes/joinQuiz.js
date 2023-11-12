import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const joinQuiz = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

    const { id } = req.user;

    const checkQuizDate = await prisma.quiz.findFirst({
      where: { id: Number(req.params.id) },
    });

    const { startDate, endDate } = checkQuizDate;

    if (startDate > currentDate) {
      return res.json({
        msg: 'Quiz has not started',
      });
    }

    if (endDate < currentDate) {
      return res.json({
        msg: 'Quiz has already ended',
      });
    }

    const getQuestions = await prisma.quiz.findFirst({
      where: { id: Number(req.params.id) },
      include: {
        questions: true,
      },
    });

    const questionList = getQuestions.questions.map((questions) => questions.question);

    return res.status(200).json({
      statusCode: res.statusCode,
      data: questionList,
    });
    // const { quizId, questionId}
    // const { id } = req.user;
    // ["true", "true", "true", "false", "true", "false"] User answers
    // questions.map(question => question.correctAnswer)
    // api/v1/quizzes/join/{id}/ Get list of questions
    // api/v1/qizzues/join/{id}
    // const getQuestions = await prisma.quiz.findFirst({
    //     where: { id: Number(16) },
    //     include: {
    //       questions: true,
    //     }
    //   });
    //   console.log(getQuestions.questions.map(question => `${question.question} ${question.correctAnswer}`))
    //   return res.json({
    //     data: getQuestions
    //   })
    // if (id !== 'BASIC_USER') {
    //   return res.status(401).json({
    //     statusCode: res.statusCode,
    //     msg: 'Only basic users may join a quiz',
    //   });
    // }
  } catch (error) {
    return res.status(500).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const answerQuiz = async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

export default joinQuiz;
