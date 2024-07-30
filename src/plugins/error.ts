import { FastifyPluginCallback } from 'fastify';

import fp from 'fastify-plugin';
import { isHttpError } from '../tools/httpError';

const errorPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.setErrorHandler((error, request, reply) => {
    if (isHttpError(error)) {
      reply.status(error.statusCode).send({
        message: error.message,
        name: error.name,
      });
    }
    done();
  });

  done();
};

export default fp(errorPlugin);
