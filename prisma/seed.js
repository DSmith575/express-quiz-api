import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
// assert seems to be required for the JSON file to work? Not to sure why that is.
import superAdmins from '../utils/seedScripts/superUsers.json' assert { type: 'json' };

const prisma = new PrismaClient();

const PROFILE_URL = process.env.USER_PROFILE_PIC;

const main = async () => {
  try {
    for (let i = 0; i < superAdmins.data.length; i++) {
      const superSeed = superAdmins.data[i];

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            {
              username: superSeed.username,
            },
            {
              email: superSeed.email,
            },
          ],
        },
      });

      if (!existingUser) {
        // const userData = {
        //   firstName: superSeed.firstName,
        //   lastName: superSeed.firstName,
        //   username: superSeed.username,
        //   email: superSeed.email,
        //   password: superSeed.password,
        //   role: superSeed.role,
        // };

        const { firstName, lastName, username, email, password, role } = superSeed;

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
            role,
          },
        });
      } else {
        console.log(`User with username ${superSeed.username} or email ${superSeed.email} already exists.`);
      }
    }
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error seeding Super admins', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
