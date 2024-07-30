import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function healthRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get('/check', (_, repley) => {
    repley.send({ result: true });
  });
}
