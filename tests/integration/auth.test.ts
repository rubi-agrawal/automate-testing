/**
 * @jest-environment node
 */
import { POST as registerPOST } from "@/app/api/auth/register/route";
import { POST as loginPOST } from "@/app/api/auth/login/route";
import { GET as meGET } from "@/app/api/auth/me/route";
import { createMockRequest } from "../utils/testHelpers";

describe("Auth API Integration", () => {
  const testUser = {
    name: "Test User",
    email: `auth-test-${Date.now()}@example.com`,
    password: "password123",
  };

  it("registers a new user", async () => {
    const req = createMockRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: testUser,
    });
    const res = await registerPOST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.user.email).toBe(testUser.email);
    expect(json.data.token).toBeTruthy();
  });

  it("rejects duplicate email registration", async () => {
    const req = createMockRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: testUser,
    });
    const res = await registerPOST(req);
    expect(res.status).toBe(409);
  });

  it("logs in with valid credentials", async () => {
    const req = createMockRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: { email: testUser.email, password: testUser.password },
    });
    const res = await loginPOST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.token).toBeTruthy();
  });

  it("rejects invalid login", async () => {
    const req = createMockRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: { email: testUser.email, password: "wrongpassword" },
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(401);
  });

  it("returns current user with valid token", async () => {
    const loginReq = createMockRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: { email: testUser.email, password: testUser.password },
    });
    const loginRes = await loginPOST(loginReq);
    const loginJson = await loginRes.json();

    const meReq = createMockRequest("http://localhost:3000/api/auth/me", {
      token: {
        userId: loginJson.data.user.id,
        email: testUser.email,
        role: "user",
      },
    });
    const meRes = await meGET(meReq);
    const meJson = await meRes.json();

    expect(meRes.status).toBe(200);
    expect(meJson.data.email).toBe(testUser.email);
  });
});
