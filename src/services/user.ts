import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { existsByLoginId, setUser } from '../handlers/userHandler';
import { CreateUser } from '../inerfaces/user';
import { UnauthorizedError } from '../tools/errors/unauthorizedError';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserBody } from '../routes/api/v1/auth/schema';
import { gerateUserToken } from '../tools/jwt';
import { setCookie } from '../tools/cookie';

export async function signUp(
  fastify: FastifyInstance,
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
      email: email,
      password: bcrypt.hashSync(password, 10),
    };

    const user = await setUser(task);

    const tokens = gerateUserToken(fastify, user);

    setCookie(reply, 'accessToken', tokens.accessToken, { maxAge: 3600 * 24 });
    setCookie(reply, 'refreshToken', tokens.refreshToken, {
      maxAge: 3600 * 24 * 30,
    });

    return { user: { ...user, password: undefined }, tokens };
  } catch (e) {
    throw e;
  }
}
