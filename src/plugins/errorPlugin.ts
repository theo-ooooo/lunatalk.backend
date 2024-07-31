import { FastifyPluginCallback } from 'fastify';

import fp from 'fastify-plugin';
import { isHttpError } from '../tools/errors/httpError';

const errorPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.addHook('onError', (request, reply, error, done) => {
    request.log.error(error, 'fastify onError');

    done();
  });
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
      reply.status(error.statusCode || 500).send({
        result: false,
        data: {
          message: error.message || 'Internal Server Error',
          code: error.code || 'Error',
        },
      });
    }
    done();
  });

  done();
};

export default fp(errorPlugin);
