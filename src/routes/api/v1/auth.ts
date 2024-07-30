import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function authRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post('/sign_in', (reqeust, reply) => {
    reply.send({ result: true });
  });
  fastify.post('/sign_up', (_, reply) => {
    reply.send({ result: true });
  });
}
