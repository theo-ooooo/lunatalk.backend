import fastify from 'fastify';
import fs from 'fs';

export function checkEnviroment(): { result: boolean; message?: string } {
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

export async function startServer(app: typeof fastify) {
  try {
    await app({ logger: true }).listen({ port: 3000 });
    console.log(`Server is running at http://localhost:3000`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
