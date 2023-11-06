import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

const getUser = async (req, res) => {
  try {
    const userID = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });

    const { id, role } = req.user;

    if (!userID) {
      return res.status(404).json({
        msg: `User with the id of ${req.params.id} not found`,
      });
    }

    if (role !== 'SUPER_ADMIN_USER' && id !== userID.id) {
      return res.status(403).json({
        msg: `Not authorized to access this profile`,
      });
    }

    return res.json({
      data: userID,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      return res.status(404).json({
        msg: 'No users found',
      });
    }

    const { role } = req.user;

    if (role !== 'SUPER_ADMIN_USER') {
      return res.status(403).json({
        msg: `Not authorized to access this route`,
      });
    }

    return res.json({
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    let user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });

    const { id, role } = req.user;
    const username = user.username;
    const { password, ...restOfBody } = req.body;

    if (!user) {
      return res.status(404).json({
        msg: `No user with the id ${user.id} found`,
      });
    }

    if (id !== user.id && role !== 'SUPER_ADMIN_USER') {
      return res.status(403).json({
        msg: `You are not authorized to access this route`,
      });
    }

    if (password) {
      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(req.body.password, salt);

      user = await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: {
          ...restOfBody,
          password: hashedPassword,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: {
          ...restOfBody,
        },
      });
    }

    return res.json({
      msg: `User ${username} successfully updated`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

export { getUser, getUsers, updateUser };
