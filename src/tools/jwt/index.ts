import { SignOptions } from '@fastify/jwt';
import { User } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../errors/unauthorizedError';
import { findById } from '../../handlers/userHandler';
import { clearCookie, setCookie } from '../cookie';
import { NotFoundError } from '../errors/notFoundError';

function generateToken(
  fastify: FastifyInstance,
  payload: any,
  options?: SignOptions
) {
  const jwtOptions = {
    iss: 'lunatalk.co.kr',
    ...options,
  };

  if (payload?.password) {
    delete payload.password;
  }

  const token = fastify.jwt.sign(payload, jwtOptions);

  return token;
}

export function gerateUserToken(
  fastify: FastifyInstance,
  user: Omit<User, 'password'>
) {
  const accessToken = generateToken(fastify, user, {
    sub: 'accessToken',
    expiresIn: '1d',
    notBefore: 0,
  });

  const refreshToken = generateToken(fastify, user, {
    sub: 'refreshToken',
    expiresIn: '30d',
    notBefore: 0,
  });

  return { accessToken, refreshToken };
}

export async function restoreUserToken(
  fastify: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const refreshToken: string | undefined = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedError('not logged in');
    }

    const decoded = fastify.jwt.decode<User>(refreshToken);

    if (!decoded) {
      throw new UnauthorizedError('token invalid');
    }

    const user = await findById(decoded.id);

    if (!user) {
      throw new NotFoundError('user not found');
    }

    const tokens = gerateUserToken(fastify, user);

    setCookie(reply, 'accessToken', tokens.accessToken);
    setCookie(reply, 'refreshToken', tokens.refreshToken);

    return tokens;
  } catch (e) {
    throw e;
  }
}
