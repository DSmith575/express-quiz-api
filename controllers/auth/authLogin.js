import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

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
        return res.status(401).json({
          msg: 'Invalid email or username',
        });
      }
  
      const correctPassword = await bcryptjs.compare(password, user.password);
  
      if (!correctPassword) {
        return res.status(401).json({
          msg: 'Invalid password',
        });
      }
  
      const { JWT_SECRET, JWT_LIFETIME } = process.env;
  
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        JWT_SECRET,
        { expiresIn: JWT_LIFETIME },
      );
  
      return res.status(200).json({
        msg: `${user.username} successfully logged in`,
        token,
      });
    } catch (error) {
      return res.status(500).json({
        msg: error.message,
      });
    }
  };

  export default login;