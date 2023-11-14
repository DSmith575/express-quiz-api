import { PrismaClient } from '@prisma/client';
import saltHashPassword from '../../../utils/userRegister/passwordUtils.js';
import genUuidSeed from '../../../utils/userRegister/registeruuid.js';

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
        statusCode: res.statusCode,
        msg: 'Username or Email already exists',
      });
    }

    // hashing password via function in utils/userRegister
    const hashedPassword = await saltHashPassword(password);

    // Using uuid package to generate a random seed for each user created, this is done with a function created in utils/userRegister
    const profilePictureSeed = genUuidSeed();

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
      statusCode: res.statusCode,
      msg: 'User successfully created',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

export default register;
