import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  role: z.enum(["admin", "user"]).optional().default("user"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(5000).optional().default(""),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  status: z
    .enum(["todo", "in_progress", "review", "done", "cancelled"])
    .default("todo"),
  dueDate: z.string().datetime().optional().nullable(),
});

export const taskUpdateSchema = taskSchema.partial();

export const bugReportSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(10, "Description must be at least 10 characters"),
  severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  status: z
    .enum(["open", "in_progress", "resolved", "closed", "wont_fix"])
    .optional(),
  stepsToReproduce: z.string().max(5000).optional(),
  expectedBehavior: z.string().max(2000).optional(),
  actualBehavior: z.string().max(2000).optional(),
});

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  category: z.enum(["usability", "performance", "feature", "bug", "other"]),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  suggestions: z.string().max(5000).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  status: z.string().optional(),
  priority: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type BugReportInput = z.infer<typeof bugReportSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
