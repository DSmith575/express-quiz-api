/**
 * @description User register and login functions
 * @file auth.js
 *
 * @author Deacon Smith
 *
 * @created 4/11/2023
 * @updated 4/11/2023
 *
 */

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { PrismaClient } from '@prisma/client';

const PROFILE_URL = process.env.USER_PROFILE_PIC;

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { username, firstName, lastName, email, role, password } = req.body;

    let user = await prisma.user.findFirst({
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

    if (user) {
      return res.status(409).json({
        msg: 'Username or Email already exists',
      });
    }

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Using uuid package to generate a random seed
    const profilePictureSeed = uuidv4();
    const getUserProfilePicture = `${PROFILE_URL}?seed=${profilePictureSeed}`;

    user = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        role,
        password: hashedPassword,
        avatar: getUserProfilePicture,
      },
    });

    delete user.password;

    return res.status(201).json({
      msg: 'User successfully created',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

export { register };
