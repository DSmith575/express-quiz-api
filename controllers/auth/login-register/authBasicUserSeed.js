/**
 * @description allows admins to seed basic users
 * @file authBasicUserSeed.js
 *
 * @function seedBasicUsers seeds a list of basic users from a github gist
 *
 * @author Deacon Smith
 * @created 14-11-2023
 * @updated 15-11-2023
 */

import { PrismaClient } from '@prisma/client';
import saltHashPassword from '../../../utils/userRegister/passwordUtils.js';
import genUuidSeed from '../../../utils/userRegister/registeruuid.js';
import { seedGist } from '../../../utils/axios/instance.js';
import statCodes from '../../../utils/statusCodes/statusCode.js';
import userRoles from '../../../utils/consonants/globalConsonants.js';

// This does not check if the users already exists
// It will still return a seed successful for basic users, but they are not duplicated

const prisma = new PrismaClient();

const PROFILE_URL = process.env.USER_PROFILE_PIC;

const seedBasicUsers = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== userRoles.USER_ROLES.super) {
      return res.status(statCodes.FORBIDDEN).json({
        statusCode: res.statusCode,
        msg: 'Not authorized to access this route',
      });
    }

    // Using axios instance for the url
    // destructing { data } to retrieve data: [] instead of data: data []
    const seedUsers = await seedGist.get();
    const { data } = await seedUsers.data;

    for (let i = 0; i < data.length; i++) {
      const basicUser = data[i];

      const { firstName, lastName, username, email, password } = basicUser;

            // Hash&salt password and generate random seed for profile pictures
      const hashedPassword = await saltHashPassword(password);
      const profilePictureSeed = genUuidSeed();

      const getUserProfilePicture = `${PROFILE_URL}?seed=${profilePictureSeed}`;

      await prisma.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          password: hashedPassword,
          avatar: getUserProfilePicture,
        },
      });
    }

    return res.status(statCodes.OK).json({
      statusCode: res.statusCode,
      msg: 'Basic users seeded successfully',
    });
  } catch (error) {
    return res.status(statCodes.SERVER_ERROR).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

export default seedBasicUsers;
