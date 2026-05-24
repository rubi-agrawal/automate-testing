import { MongoMemoryServer } from "mongodb-memory-server";

export default async function globalSetup() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = "test-jwt-secret";
  // @ts-expect-error global mongo instance for teardown
  global.__MONGOSERVER__ = mongoServer;
}
