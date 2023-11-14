import { PrismaClient } from '@prisma/client';
import statCodes from '../../../utils/statusCodes/statusCode.js';

const prisma = new PrismaClient();

const getScore = async (req, res) => {
  try {
    const quizScores = await prisma.userQuizScore.findMany({
      where: { quizId: Number(req.params.id) },
    });

    return res.status(statCodes.OK).json({
      msg: quizScores,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const getScores = async (req, res) => {
  try {
    const getQuizScores = await prisma.userQuizScore.findMany({});

    return res.status(statCodes.OK).json({
      msg: getQuizScores,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      msg: error.message,
    });
  }
};

export { getScore, getScores };
