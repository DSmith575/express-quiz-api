import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createQuiz = async (req, res) => {
  try {
    const { name, difficulty } = req.body;

    const { role } = req.user;

    if (role !== 'SUPER_ADMIN_USER') {
      return res.status(403).json({
        msg: 'Not authorized to access this route',
      });
    }

    return res.json({
      msg: name,
      difficulty,
    });
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

export { createQuiz, deleteQuiz };
