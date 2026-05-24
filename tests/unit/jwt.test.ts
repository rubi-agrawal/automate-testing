import { signToken, verifyToken, getTokenFromHeader } from "@/lib/jwt";

describe("JWT Utilities", () => {
  const payload = {
    userId: "507f1f77bcf86cd799439011",
    email: "test@example.com",
    role: "user" as const,
  };

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  it("signs and verifies a token", () => {
    const token = signToken(payload);
    expect(token).toBeTruthy();
    const decoded = verifyToken(token);
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe("user");
  });

  it("returns null for invalid token", () => {
    expect(verifyToken("invalid.token.here")).toBeNull();
  });

  it("extracts token from Bearer header", () => {
    const token = signToken(payload);
    expect(getTokenFromHeader(`Bearer ${token}`)).toBe(token);
  });

  it("returns null for missing Bearer prefix", () => {
    expect(getTokenFromHeader("Basic abc")).toBeNull();
    expect(getTokenFromHeader(null)).toBeNull();
  });
});
