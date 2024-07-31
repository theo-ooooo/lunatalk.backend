import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { existsByLoginId, setUser } from '../handlers/userHandler';
import { CreateUser } from '../inerfaces/user';
import { UnauthorizedError } from '../tools/errors/unauthorizedError';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserBody, SignInUserBody } from '../routes/api/v1/auth/schema';
import { gerateUserToken } from '../tools/jwt';
import { setCookie } from '../tools/cookie';
import { Time } from '../tools/constants/time';

function signInProcess(
  fastify: FastifyInstance,
  reply: FastifyReply,
  user: User
) {
  const tokens = gerateUserToken(fastify, user);

  setCookie(reply, 'accessToken', tokens.accessToken, {
    maxAge: Time.ONE_DAY_S,
  });
  setCookie(reply, 'refreshToken', tokens.refreshToken, {
    maxAge: Time.ONE_DAY_S * 30,
  });
  return tokens;
}

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

    const tokens = signInProcess(fastify, reply, user);

    return { tokens };
  } catch (e) {
    throw e;
  }
}

export async function signIn(
  fastify: FastifyInstance,
  request: FastifyRequest<{ Body: SignInUserBody }>,
  reply: FastifyReply
) {
  try {
    const { loginId, password } = request.body;

    const signInUser = await existsByLoginId(loginId);

    if (!signInUser) {
      throw new UnauthorizedError('user not found');
    }

    const { password: hashedPassword } = signInUser;

    const isMatch = bcrypt.compareSync(password, hashedPassword);

    if (!isMatch) {
      throw new UnauthorizedError('password mismatch');
    }

    const tokens = signInProcess(fastify, reply, signInUser);

    return { tokens };
  } catch (e) {
    throw e;
  }
}
