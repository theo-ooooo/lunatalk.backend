import { FastifyPluginCallback } from 'fastify';

import fp from 'fastify-plugin';
import { isHttpError } from '../tools/errors/httpError';

const errorPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      result: false,
      error: {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Internal Server Error',
        name: error.name || 'Error',
        statusCode,
      },
    });
    done();
  });

  done();
};

export default fp(errorPlugin);
