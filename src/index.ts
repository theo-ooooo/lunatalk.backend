import fastify from 'fastify';
import dotenv from 'dotenv';
// 환경 변수 로드
dotenv.config();

const server = fastify({ logger: true });

server.get('/health', async (_, reply) => {
  reply.status(200).send({ status: true, data: { message: 'done' } });
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log(`Server is running at http://localhost:3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
