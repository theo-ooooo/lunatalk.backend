import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { UnauthorizedError } from '../tools/errors/unauthorizedError';

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.includes('/auth/logout')) return;

    const accessToken: string | undefined =
      request.cookies.accessToken ||
      request.headers.authorization?.split(' ')[1];
    // const refreshToken: string | undefined = request.cookies['refresh_token'];

    if (!accessToken) {
      return;
    }
    try {
      await request.jwtVerify();
    } catch (e) {
      throw new UnauthorizedError(`access token invalid`);
    }
  });
};

export default fp(authPlugin);
