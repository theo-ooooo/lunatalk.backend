import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { signIn, signUp } from '../../../../services/userService';
import {
  CreateUserBody,
  createUserBodySchema,
  SignInUserBody,
  signInUserBodySchema,
} from './schema';
import { logout } from '../../../../services/authService';

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

  fastify.post('/logout', (_, reply) => {
    return logout(reply);
  });
}
