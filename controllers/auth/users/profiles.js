import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUser = async (req, res) => {
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
      msg: `nope`,
    });
  }

  return res.json({
    data: userID,
  });
};

export default getUser;
