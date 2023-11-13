import { PrismaClient } from '@prisma/client';
import averageCalc from '../../../utils/consonants/globalConsonants.js';

const prisma = new PrismaClient();

const joinQuiz = async (req, res) => {
  try {
    const { role } = req.user;

    const currentDate = new Date().toISOString().split('T')[0];

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

    // if (role !== 'BASIC_USER') {
    //   return res.status(401).json({
    //     statusCode: res.statusCode,
    //     msg: 'Only basic users can participate in a quiz',
    //   });
    // }

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
  } catch (error) {
    return res.status(500).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const answerQuiz = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

    // Including questions to get the length of total questions in quiz and for mapping correct answers for comparison
    const quizAnswers = await prisma.quiz.findFirst({
      where: { id: Number(req.params.id) },
      include: {
        questions: true,
      },
    });

    const { startDate, endDate, questions } = quizAnswers;

    // Get the length of question.
    // Used for calculating average score
    // and for checking if the user has answered all questions
    const quizTotalQuestions = questions.length;

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

    const answers = req.body;

    if (Object.keys(answers).length === 0) {
      return res.json({
        msg: 'Answers must be submitted in array format',
      });
    }

    if (answers.length < quizTotalQuestions) {
      return res.json({
        msg: `Please answer all ${quizTotalQuestions} questions`,
      });
    }

    const { id, username } = req.user;

    // check if already parcitipated.
    const checkParticipation = await prisma.userParticipateQuiz.findFirst({
      where: {
        userId: id,
        quizId: Number(req.params.id),
      },
    });

    if (checkParticipation) {
      return res.status(401).json({
        msg: 'You have already participated in this quiz',
      });
    }

    // Map to get a list of all correct answers
    const quizCorrectAnswer = quizAnswers.questions.map((question) => question.correctAnswer);

    // map users answers and check if it is strictly equal to the correct answer and pushes true/false values
    // Object values: users ID, quizID, each questionID and the users answer
    // Returns true to the isCorrect schema value if the answer is strictly equal to the quizCorrectAnswer variable
    const userAnswers = answers.map((answer, index) => ({
      userId: id,
      quizId: Number(req.params.id),
      questionId: quizAnswers.questions[index].id,
      answer,
      isCorrect: answer === quizCorrectAnswer[index],
    }));

    // Using filter to go through each of the userAnswers isCorrect fields, and returning the length
    const userCorrectAnswers = userAnswers.filter((answer) => answer.isCorrect).length;

    // Get the average score from the users answers
    // averageCalc.calculate = 100
    const averageScore = (userCorrectAnswers / quizTotalQuestions) * averageCalc.QUIZ_AVERAGE.calculate;

    // Prisma createMany on the users answers
    await prisma.userQuestionAnswer.createMany({
      data: userAnswers,
    });

    // Prisma create on the userParticipation
    await prisma.userParticipateQuiz.create({
      data: {
        userId: id,
        quizId: Number(req.params.id),
      },
    });

    // Prisma create on the users score for that quiz,
    await prisma.userQuizScore.create({
      data: {
        userId: id,
        quizId: Number(req.params.id),
        score: userCorrectAnswers,
      },
    });

    return res.status(200).json({
      statusCode: res.statusCode,
      msg: `${username} has successfully in ${quizAnswers.name}`,
      userScore: `${userCorrectAnswers}/${quizTotalQuestions}`,
      averageScore: `${averageScore}%`,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

export { joinQuiz, answerQuiz };
