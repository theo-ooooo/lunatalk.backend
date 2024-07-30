import { User } from '@prisma/client';
import prismaClient from '../tools/client';

export async function setUser(
  user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    return await prismaClient.user.create({ data: user });
  } catch (e) {
    throw e;
  }
}

export async function existsByLoginId(loginId: string) {
  try {
    return await prismaClient.user.findUnique({ where: { loginId } });
  } catch (e) {
    throw e;
  }
}
