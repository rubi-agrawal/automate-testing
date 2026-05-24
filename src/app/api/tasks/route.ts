import { NextRequest } from "next/server";
import { getAuthFromRequest, requireAuth } from "@/lib/auth";
import { taskSchema, paginationSchema } from "@/lib/validations";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";
import * as taskService from "@/services/taskService";
import { logActivity } from "@/services/activityService";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(getAuthFromRequest(request));
    const { searchParams } = new URL(request.url);

    const query = paginationSchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
    });

    if (!query.success) {
      return errorResponse("Invalid query parameters", 400);
    }

    const result = await taskService.getTasks({
      ...query.data,
      userId: auth.userId,
      isAdmin: auth.role === "admin",
    });

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(getAuthFromRequest(request));
    const body = await request.json();
    const parsed = taskSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    const task = await taskService.createTask({
      title: parsed.data.title,
      description: parsed.data.description,
      priority: parsed.data.priority,
      status: parsed.data.status,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      createdBy: auth.userId,
    });

    await logActivity({
      action: "create",
      entity: "task",
      entityId: task._id.toString(),
      userId: auth.userId,
    });

    return successResponse(task, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
