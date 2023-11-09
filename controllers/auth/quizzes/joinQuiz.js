import { PrismaClient } from '@prisma/client';

const joinQuiz = async (req, res) => {
  try {
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
