import {
  registerSchema,
  loginSchema,
  taskSchema,
  bugReportSchema,
  feedbackSchema,
} from "@/lib/validations";

describe("API Validations", () => {
  describe("registerSchema", () => {
    it("validates correct registration data", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects short password", () => {
      const result = registerSchema.safeParse({
        name: "John",
        email: "john@example.com",
        password: "short",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid email", () => {
      const result = registerSchema.safeParse({
        name: "John",
        email: "not-an-email",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("validates login credentials", () => {
      const result = loginSchema.safeParse({
        email: "user@test.com",
        password: "anypassword",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("taskSchema", () => {
    it("validates task with defaults", () => {
      const result = taskSchema.safeParse({ title: "My Task" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priority).toBe("medium");
        expect(result.data.status).toBe("todo");
      }
    });

    it("rejects empty title", () => {
      const result = taskSchema.safeParse({ title: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("bugReportSchema", () => {
    it("validates bug report", () => {
      const result = bugReportSchema.safeParse({
        title: "Bug",
        description: "This is a detailed bug description for testing",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("feedbackSchema", () => {
    it("validates feedback", () => {
      const result = feedbackSchema.safeParse({
        rating: 5,
        category: "usability",
        message: "Great platform, very easy to use for task management",
      });
      expect(result.success).toBe(true);
    });

    it("rejects rating out of range", () => {
      const result = feedbackSchema.safeParse({
        rating: 6,
        category: "usability",
        message: "Great platform for testing purposes here",
      });
      expect(result.success).toBe(false);
    });
  });
});
