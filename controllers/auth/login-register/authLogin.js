import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import statCodes from '../../../utils/statusCodes/statusCode.js';

const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });

    if (!user) {
      return res.status(statCodes.BAD_REQUEST).json({
        statusCode: res.statusCode,
        msg: 'Invalid email or username',
      });
    }

    const correctPassword = await bcryptjs.compare(password, user.password);

    if (!correctPassword) {
      return res.status(statCodes.BAD_REQUEST).json({
        statusCode: res.statusCode,
        msg: 'Invalid password',
      });
    }

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_LIFETIME },
    );

    return res.status(statCodes.OK).json({
      statusCode: res.statusCode,
      msg: `${user.username} successfully logged in`,
      token,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

export default login;
