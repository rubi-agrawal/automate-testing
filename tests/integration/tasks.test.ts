/**
 * @jest-environment node
 */
import { POST as registerPOST } from "@/app/api/auth/register/route";
import { GET as tasksGET, POST as tasksPOST } from "@/app/api/tasks/route";
import { PUT as taskPUT, DELETE as taskDELETE } from "@/app/api/tasks/[id]/route";
import { createMockRequest } from "../utils/testHelpers";
import { mockUser, mockTask } from "../utils/mockData";

describe("Tasks API Integration", () => {
  let userId: string;
  let token: { userId: string; email: string; role: "user" };

  beforeAll(async () => {
    const uniqueUser = {
      ...mockUser,
      email: `tasks-${Date.now()}@example.com`,
    };
    const req = createMockRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: uniqueUser,
    });
    const res = await registerPOST(req);
    const json = await res.json();
    userId = json.data.user.id;
    token = { userId, email: uniqueUser.email, role: "user" };
  });

  it("creates a task", async () => {
    const req = createMockRequest("http://localhost:3000/api/tasks", {
      method: "POST",
      body: mockTask,
      token,
    });
    const res = await tasksPOST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.data.title).toBe(mockTask.title);
  });

  it("lists tasks with pagination", async () => {
    const req = createMockRequest("http://localhost:3000/api/tasks", {
      token,
      searchParams: { page: "1", limit: "10" },
    });
    const res = await tasksGET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json.data.tasks)).toBe(true);
    expect(json.data.pagination).toBeDefined();
  });

  it("updates and deletes a task", async () => {
    const createReq = createMockRequest("http://localhost:3000/api/tasks", {
      method: "POST",
      body: { ...mockTask, title: "Task to Update" },
      token,
    });
    const createRes = await tasksPOST(createReq);
    const createJson = await createRes.json();
    const taskId = createJson.data._id;

    const updateReq = createMockRequest(
      `http://localhost:3000/api/tasks/${taskId}`,
      {
        method: "PUT",
        body: { status: "in_progress" },
        token,
      }
    );
    const updateRes = await taskPUT(updateReq, {
      params: Promise.resolve({ id: taskId }),
    });
    const updateJson = await updateRes.json();
    expect(updateJson.data.status).toBe("in_progress");

    const deleteReq = createMockRequest(
      `http://localhost:3000/api/tasks/${taskId}`,
      { method: "DELETE", token }
    );
    const deleteRes = await taskDELETE(deleteReq, {
      params: Promise.resolve({ id: taskId }),
    });
    expect(deleteRes.status).toBe(200);
  });

  it("rejects unauthenticated requests", async () => {
    const req = createMockRequest("http://localhost:3000/api/tasks");
    const res = await tasksGET(req);
    expect(res.status).toBe(401);
  });
});
