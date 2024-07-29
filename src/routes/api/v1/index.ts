import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import authRoutes from './auth';

export async function apiV1Plugin(fastify: FastifyInstance) {
  fastify.register((instance) => {
    instance.register(authRoutes, { prefix: 'auth' });
  });
}
