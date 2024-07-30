// types/fastify.d.ts
import { User } from '@prisma/client';
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: User | null; // Add the user property to the request object
  }
}
