// src/index.ts
import fastify from "fastify";
import mercurius from "mercurius";
import { schema } from "./schema";

const server = fastify({ logger: true });

server.register(mercurius, {
  schema,
  graphiql: true, // GraphiQL 인터페이스를 활성화합니다.
});

server.get("/", async (request, reply) => {
  return { status: true, data: { message: "done" } };
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
