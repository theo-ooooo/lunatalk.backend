import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { UnauthorizedError } from '../tools/errors/unauthorizedError';
import { clearCookie } from '../tools/cookie';
import { restoreUserToken } from '../tools/jwt';
import { User } from '@prisma/client';

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.includes('/auth/logout')) return;

    let accessToken: string | undefined =
      request.cookies.accessToken ||
      request.headers.authorization?.split(' ')[1];
    const refreshToken: string | undefined = request.cookies['refreshToken'];

    try {
      if (!accessToken && !refreshToken) {
        return;
      }
      if (accessToken) {
        await request.jwtVerify();
        return;
      }
      if (refreshToken) {
        const tokens = await restoreUserToken(fastify, request, reply);
        accessToken = tokens.accessToken;

        const accessTokenData = fastify.jwt.verify<User>(accessToken);
        request.user = accessTokenData;
        return;
      }
    } catch (e) {
      // throw new UnauthorizedError(`access token invalid`);
      try {
        if (refreshToken) {
          const tokens = await restoreUserToken(fastify, request, reply);
          accessToken = tokens.accessToken;

          const accessTokenData = fastify.jwt.verify<User>(accessToken);
          request.user = accessTokenData;
          return;
        }
      } catch (e) {
        clearCookie(reply, 'accessToken');
        clearCookie(reply, 'refreshToken');
      }
    }
  });
};

export default fp(authPlugin);
