import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function authRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post('/sign_in', (_, repley) => {
    repley.send({ result: true });
  });
  fastify.post('/sign_up', (_, repley) => {
    repley.send({ result: true });
  });
}
