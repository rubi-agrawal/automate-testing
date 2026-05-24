import mongoose from "mongoose";

beforeAll(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).mongooseCache = undefined;
  if (mongoose.connection.readyState === 0 && process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});
