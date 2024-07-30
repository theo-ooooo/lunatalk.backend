import fastify from 'fastify';
import dotenv from 'dotenv';
import { checkEnvironment, initServer, startServer } from './server';
// 환경 변수 로드
dotenv.config();

const server = fastify({ logger: true });

const environmentCheck = checkEnvironment();

if (environmentCheck?.result === true) {
  initServer(server);
  startServer(server);
} else {
  console.error(environmentCheck.message);
  process.exit(1);
}
