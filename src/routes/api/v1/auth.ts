import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { UnauthorizedError } from '../../../tools/errors/unauthorizedError';
import { signUp } from '../../../services/user';
import { CreateUser } from '../../../inerfaces/user';

export default async function authRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post(
    '/sign_up',
    async (
      request: FastifyRequest<{ Body: CreateUser }>,
      reply: FastifyReply
    ) => {
      return await signUp(request, reply);
    }
  );
  // fastify.post('/sign_up', (_, reply) => {
  //   reply.send({ result: true });
  // });
}
