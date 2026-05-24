export default async function globalTeardown() {
  // @ts-expect-error global mongo instance
  const mongoServer = global.__MONGOSERVER__;
  if (mongoServer) {
    await mongoServer.stop();
  }
}
