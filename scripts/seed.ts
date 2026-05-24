/**
 * Seed demo users for local development / viva demo.
 * Run: npm run seed
 */
import mongoose from "mongoose";
import User from "../src/models/User";
import { hashPassword } from "../src/lib/auth";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/qa-platform";

const DEMO_USERS = [
  {
    name: "Admin User",
    email: "admin@qaplatform.com",
    password: "Admin@123",
    role: "admin" as const,
  },
  {
    name: "Demo User",
    email: "user@qaplatform.com",
    password: "User@123",
    role: "user" as const,
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  for (const demo of DEMO_USERS) {
    const existing = await User.findOne({ email: demo.email });
    if (existing) {
      console.log(`Skipped (exists): ${demo.email}`);
      continue;
    }
    const hashed = await hashPassword(demo.password);
    await User.create({
      name: demo.name,
      email: demo.email,
      password: hashed,
      role: demo.role,
    });
    console.log(`Created: ${demo.email} (${demo.role})`);
  }

  console.log("\nDemo login credentials:");
  console.log("─────────────────────────────────────────");
  console.log("Admin  | admin@qaplatform.com | Admin@123");
  console.log("User   | user@qaplatform.com  | User@123");
  console.log("─────────────────────────────────────────");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
