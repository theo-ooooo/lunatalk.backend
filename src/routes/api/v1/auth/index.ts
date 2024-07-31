import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { UnauthorizedError } from '../../../../tools/errors/unauthorizedError';
import { signUp } from '../../../../services/user';
import { CreateUser } from '../../../../inerfaces/user';
import { CreateUserBody, createUserBodySchema } from './schema';

export default async function authRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post<{ Body: CreateUserBody }>(
    '/sign_up',
    { schema: { body: createUserBodySchema } },
    async (request, reply) => {
      try {
        return await signUp(fastify, request, reply);
      } catch (e) {
        throw e;
      }
    }
  );
  // fastify.post('/sign_up', (_, reply) => {
  //   reply.send({ result: true });
  // });
}
