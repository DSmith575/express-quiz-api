/**
 * @description CRUD functionality to for user information
 * @file profiles.js
 *
 * @function getUser get information on a user by id
 * @function getUsers get information on all users
 * @function updateUser updated a users information by id
 * @function deleteUser delete a user by id
 * @function deleteAllBasicUsers delete all users who have the role of BASIC_USER
 *
 * @author Deacon Smith
 * @created 06-11-2023
 * @updated 15-11-2023
 */

import { PrismaClient } from '@prisma/client';
import statCodes from '../../../utils/statusCodes/statusCode.js';
import userRoles from '../../../utils/consonants/globalConsonants.js';
import saltHashPassword from '../../../utils/userRegister/passwordUtils.js';

const prisma = new PrismaClient();

const getUser = async (req, res) => {
  try {
    const userID = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });

    const { id, role } = req.user;

    if (!userID) {
      return res.status(statCodes.NOT_FOUND).json({
        statusCode: res.statusCode,
        msg: `User with the id of ${req.params.id} not found`,
      });
    }

    if (role !== userRoles.USER_ROLES.super && id !== userID.id) {
      return res.status(statCodes.FORBIDDEN).json({
        statusCode: res.statusCode,
        msg: `Not authorized to access this profile`,
      });
    }

    return res.status(statCodes.OK).json({
      data: userID,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      msg: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      return res.status(statCodes.NOT_FOUND).json({
        msg: 'No users found',
      });
    }

    const { role } = req.user;

    if (role !== userRoles.USER_ROLES.super) {
      return res.status(statCodes.FORBIDDEN).json({
        msg: `Not authorized to access this route`,
      });
    }

    return res.status(statCodes.OK).json({
      statusCode: res.statusCode,
      data: users,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
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
      return res.status(statCodes.NOT_FOUND).json({
        msg: `No user with the id ${user.id} found`,
      });
    }

    if (id !== user.id && role !== userRoles.USER_ROLES.super) {
      return res.status(statCodes.FORBIDDEN).json({
        msg: `You are not authorized to access this route`,
      });
    }

    if (user.role === userRoles.USER_ROLES.super) {
      return res.status(statCodes.FORBIDDEN).json({
        msg: `Cannot update this user`,
      });
    }

    const currentUserExists = await prisma.user.findUnique({
      where: { username: String(username) },
    });

    if (currentUserExists) {
      return res.status(statCodes.CONFLICT).json({
        msg: `Username already exists`,
      });
    }

    // If a password is being updated, rehashed the new password
    if (password) {
      const hashedPassword = await saltHashPassword(req.body.password);

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

    return res.status(statCodes.OK).json({
      statusCode: res.statusCode,
      msg: `User ${currentUsername} successfully updated`,
      data: user,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
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
      return res.status(statCodes.NOT_FOUND).json({
        statusCode: res.statusCode,
        msg: `No user found`,
      });
    }

    // Check if authenticated user has auth to delete
    if (id !== userID.id && role !== userRoles.USER_ROLES.super) {
      return res.status(statCodes.FORBIDDEN).json({
        statusCode: res.statusCode,
        msg: `You are not authorized to access this route`,
      });
    }

    // Checks if a user is trying to delete themselves
    if (id === userID.id) {
      return res.status(statCodes.FORBIDDEN).json({
        statusCode: res.statusCode,
        msg: 'You are not able to delete yourself',
      });
    }

    // Check if the user being deleted is an admin and returns forbidden response
    if (userID.role === userRoles.USER_ROLES.super) {
      return res.status(403).json({
        statusCode: res.statusCode,
        msg: `You cannot delete this user`,
      });
    }

    await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });

    return res.status(statCodes.OK).json({
      statusCode: res.statusCode,
      msg: `User ${userID.username} successfully deleted`,
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

const deleteAllBasicUsers = async (req, res) => {
  try {
    const getBasicUsers = await prisma.user.findMany({
      where: { role: String(userRoles.USER_ROLES.basic) },
    });

    const { role } = req.user;

    if (role !== userRoles.USER_ROLES.super) {
      return res.status(statCodes.FORBIDDEN).json({
        statusCode: res.statusCode,
        msg: `You are not authorized to access this route`,
      });
    }

    if (getBasicUsers.length === 0) {
      return res.status(statCodes.NOT_FOUND).json({
        statusCode: res.statusCode,
        msg: `No basic users found`,
      });
    }

    await prisma.user.deleteMany({
      where: { role: String(userRoles.USER_ROLES.basic) },
    });

    return res.status(statCodes.OK).json({
      statusCode: res.statusCode,
      msg: `Basic users successfully deleted`,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

export { getUser, getUsers, updateUser, deleteUser, deleteAllBasicUsers };
