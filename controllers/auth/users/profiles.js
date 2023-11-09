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

    const { id, role, currentUsername } = req.user;
    const { username, password, ...restOfBody } = req.body;

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

    if (user.role === 'SUPER_ADMIN_USER') {
      return res.status(403).json({
        msg: `Cannot update this user`,
      });
    }

    const currentUserExists = await prisma.user.findUnique({
      where: { username: String(username) },
    });

    if (currentUserExists) {
      return res.status(409).json({
        msg: `Username already exists`,
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
          username,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: {
          ...restOfBody,
          username,
        },
      });
    }

    return res.json({
      msg: `User ${currentUsername} successfully updated`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userID = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });

    const { id, role } = req.user;

    if (!userID) {
      return res.status(404).json({
        statusCode: res.statusCode,
        msg: `No user found`,
      });
    }

    if (id !== userID.id && role !== 'SUPER_ADMIN_USER') {
      return res.status(403).json({
        statusCode: res.statusCode,
        msg: `You are not authorized to access this route`,
      });
    }

    if (id === userID.id) {
      return res.status(403).json({
        statusCode: res.statusCode,
        msg: 'You are not able to delete yourself',
      });
    }

    if (userID.role === 'SUPER_ADMIN_USER') {
      return res.status(403).json({
        statusCode: res.statusCode,
        msg: `You cannot delete this user`,
      });
    }

    await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });

    return res.status(200).json({
      statusCode: res.statusCode,
      msg: `User ${userID.username} successfully deleted`,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

export { getUser, getUsers, updateUser, deleteUser };
