import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

const responsePlugin: FastifyPluginAsync = async (fastify, _) => {
  fastify.addHook('onSend', async (_, reply, payload) => {
    try {
      const json = JSON.parse(payload as string);
      const wrappedPayload = {
        result: true,
        data: json,
      };
      reply.header('Content-Type', 'application/json; charset=utf-8');
      return JSON.stringify(wrappedPayload);
    } catch (err) {
      // JSON 파싱에 실패한 경우 원래 payload를 반환
      return payload;
    }
  });
};

export default fp(responsePlugin);
