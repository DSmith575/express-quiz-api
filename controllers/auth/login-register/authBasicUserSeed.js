import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import seedGist from '../../../utils/axios/instance.js';

// This does not check if the users already exists
// It will still return a seed successful for basic users, but they are not duplicated

const prisma = new PrismaClient();

const PROFILE_URL = process.env.USER_PROFILE_PIC;

const seedBasicUsers = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'SUPER_ADMIN_USER') {
      return res.status(403).json({
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

      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(password, salt);

      const profilePictureSeed = uuidv4();
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

    return res.status(200).json({
      statusCode: res.statusCode,
      msg: 'Basic users seeded successfully',
    });
    // const registerSeed = await registerUsers.post('auth/register', ...data);
  } catch (error) {
    return res.status(500).json({
      statusCode: res.statusCode,
      msg: error.message,
    });
  }
};

export default seedBasicUsers;
