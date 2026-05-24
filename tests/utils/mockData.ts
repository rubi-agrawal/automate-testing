export const mockUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

export const mockAdmin = {
  name: "Admin User",
  email: "admin@example.com",
  password: "adminpass123",
};

export const mockTask = {
  title: "Test Task",
  description: "Test task description",
  priority: "medium" as const,
  status: "todo" as const,
};

export const mockBug = {
  title: "Login button not working",
  description: "The login button does not respond when clicked on mobile devices",
  severity: "high" as const,
};

export const mockFeedback = {
  rating: 4,
  category: "usability" as const,
  message: "The dashboard is intuitive and easy to navigate for new users.",
  suggestions: "Add keyboard shortcuts for power users",
};
