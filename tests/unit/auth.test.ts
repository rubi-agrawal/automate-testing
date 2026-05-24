import { hashPassword, comparePassword } from "@/lib/auth";

describe("Authentication Logic", () => {
  it("hashes password with bcrypt", async () => {
    const password = "securePassword123";
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  it("compares password correctly", async () => {
    const password = "testPassword456";
    const hash = await hashPassword(password);
    expect(await comparePassword(password, hash)).toBe(true);
    expect(await comparePassword("wrongPassword", hash)).toBe(false);
  });
});
