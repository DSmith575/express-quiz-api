import { PrismaClient } from '@prisma/client';
import saltHashPassword from '../utils/userRegister/passwordUtils.js';
import genUuidSeed from '../utils/userRegister/registeruuid.js';
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
        const { firstName, lastName, username, email, password, role } = superSeed;

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
            role,
          },
        });

        console.log(`User ${superSeed.username} created successfully`);
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
