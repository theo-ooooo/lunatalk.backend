import { FastifyPluginCallback } from 'fastify';

import fp from 'fastify-plugin';
import { isHttpError } from '../tools/errors/httpError';

const errorPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.setErrorHandler((error, request, reply) => {
    if (isHttpError(error)) {
      reply.status(error.statusCode).send({
        result: false,
        data: {
          statusCode: error.statusCode,
          name: error.name,
          message: error.message,
        },
      });
    } else {
      reply.status(500).send({
        result: false,
        data: {
          message: error.message || 'Internal Server Error',
          name: error.name || 'Error',
          statusCode: 500,
        },
      });
    }
    done();
  });

  done();
};

export default fp(errorPlugin);
