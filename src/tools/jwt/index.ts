import { SignOptions } from '@fastify/jwt';
import { User } from '@prisma/client';
import { FastifyInstance } from 'fastify';

function generateToken(
  fastify: FastifyInstance,
  payload: any,
  options?: SignOptions
) {
  const jwtOptions = {
    iss: 'lunatalk.co.kr',
    ...options,
  };

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
