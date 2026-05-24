import { cn, formatDate, formatDateTime } from "@/lib/utils";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("px-2", "py-1")).toBe("px-2 py-1");
    });

    it("handles conditional classes", () => {
      expect(cn("base", false && "hidden", "visible")).toBe("base visible");
    });

    it("resolves tailwind conflicts", () => {
      const result = cn("px-2", "px-4");
      expect(result).toContain("px-4");
    });
  });

  describe("formatDate", () => {
    it("formats a date string", () => {
      const formatted = formatDate("2025-01-15");
      expect(formatted).toMatch(/Jan/);
      expect(formatted).toMatch(/2025/);
    });
  });

  describe("formatDateTime", () => {
    it("formats date with time", () => {
      const formatted = formatDateTime("2025-06-01T10:30:00Z");
      expect(formatted).toBeTruthy();
    });
  });
});
