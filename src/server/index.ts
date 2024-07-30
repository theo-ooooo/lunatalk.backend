import { FastifyInstance } from 'fastify';
import fs from 'fs';
import { healthRoutes } from "../routes/health";

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
  server.register(healthRoutes, { prefix: 'health' });
}

export async function startServer(server: FastifyInstance) {
  try {
    await server.listen({ port: 3000 });
    console.log(`Server is running at http://localhost:3000`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
