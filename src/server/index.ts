import { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import fs from 'fs';
import healthRoutes from '../routes/health';
import apiV1Routes from '../routes/api/v1';
import fastifyJwt from '@fastify/jwt';
import { authPlugin, errorPlugin } from '../plugins';
import responsePlugin from '../plugins/responsePlugin';

export function checkEnvironment(): { result: boolean; message?: string } {
  try {
    const envFileExist = fs.existsSync('.env');

    if (!envFileExist) {
      return { result: false, message: '.env file not found' };
    }
    // const configList: string[] = Object.keys(envFileExist);

    // TODO: 필수 env 키값 체크.
    return {
      result: true,
    };
  } catch (e: any) {
    return { result: false, message: e.message };
  }
}

export function initServer(server: FastifyInstance) {
  server.register(cookie, { secret: process.env.COOKIE_SECRET_KEY });
  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET_KEY as string,
    cookie: {
      cookieName: 'accessToken',
      signed: false,
    },
    sign: { expiresIn: '1d' },
  });

  server.register(authPlugin);
  server.register(responsePlugin);
  server.register(errorPlugin);

  server.register(healthRoutes, { prefix: 'health' });
  server.register(apiV1Routes, { prefix: 'api/v1' });
}

export async function startServer(server: FastifyInstance) {
  try {
    const address = await server.listen({ port: 4000 });
    console.log(`Server is running at ${address}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
