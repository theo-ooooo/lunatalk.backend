import { FastifyReply, FastifyRequest } from 'fastify';
import { existsByLoginId, setUser } from '../handlers/userHandler';
import { CreateUser } from '../inerfaces/user';
import { UnauthorizedError } from '../tools/errors/unauthorizedError';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserBody } from '../routes/api/v1/auth/schema';

export async function signUp(
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
) {
  try {
    const { loginId, password, nickname, email } = request.body;
    const userExists = await existsByLoginId(loginId);

    if (userExists) {
      throw new UnauthorizedError('user exists');
    }

    const task: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      loginId,
      nickname: nickname || null,
      email: email || null,
      password: bcrypt.hashSync(password, 10),
    };

    const user = await setUser(task);

    return user;
  } catch (e) {
    throw e;
  }
}
