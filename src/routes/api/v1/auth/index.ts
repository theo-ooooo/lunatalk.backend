import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { signIn, signUp } from '../../../../services/user';
import {
  CreateUserBody,
  createUserBodySchema,
  SignInUserBody,
  signInUserBodySchema,
} from './schema';

export default async function authRoutes(fastify: FastifyInstance) {
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
  fastify.post<{ Body: SignInUserBody }>(
    '/sign_in',
    { schema: { body: signInUserBodySchema } },
    async (request, reply) => {
      try {
        return await signIn(fastify, request, reply);
      } catch (e) {
        throw e;
      }
    }
  );
}
