import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getScore = async (req, res) => {
  try {
    const quizScores = await prisma.userQuizScore.findMany({
      where: { quizId: Number(req.params.id) },
    });

    return res.status(200).json({
      msg: quizScores,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const getScores = async (req, res) => {
  try {
    const getQuizScores = await prisma.userQuizScore.findMany({});

    return res.status(200).json({
      msg: getQuizScores,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

export { getScore, getScores };
