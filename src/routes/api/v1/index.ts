import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import authRoutes from './auth';

const apiV1Routes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(authRoutes, { prefix: 'auth' });

  done();
};

export default apiV1Routes;
