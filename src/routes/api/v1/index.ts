import { FastifyInstance } from 'fastify';
import authRoutes from './auth';

export default async function apiV1Routes(fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: 'auth' });
}
