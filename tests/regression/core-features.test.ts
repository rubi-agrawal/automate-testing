/**
 * Regression test suite — verifies core features still work after updates.
 * Run with: npm run test:regression
 */
import { registerSchema, taskSchema, loginSchema } from "@/lib/validations";
import { signToken, verifyToken } from "@/lib/jwt";
import { cn } from "@/lib/utils";

describe("Regression: Core Features", () => {
  describe("Authentication schemas", () => {
    it("registration validation remains stable", () => {
      expect(
        registerSchema.safeParse({
          name: "Regression User",
          email: "regression@test.com",
          password: "password123",
        }).success
      ).toBe(true);
    });

    it("login validation remains stable", () => {
      expect(
        loginSchema.safeParse({
          email: "user@test.com",
          password: "pass",
        }).success
      ).toBe(true);
    });
  });

  describe("Task management schemas", () => {
    it("task creation validation remains stable", () => {
      const result = taskSchema.safeParse({
        title: "Regression Task",
        priority: "high",
        status: "todo",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("JWT flow", () => {
    it("token sign/verify cycle remains stable", () => {
      process.env.JWT_SECRET = "regression-secret";
      const token = signToken({
        userId: "abc123",
        email: "reg@test.com",
        role: "user",
      });
      const decoded = verifyToken(token);
      expect(decoded?.email).toBe("reg@test.com");
    });
  });

  describe("UI utilities", () => {
    it("cn utility remains stable", () => {
      expect(cn("a", undefined, "b")).toBe("a b");
    });
  });
});
