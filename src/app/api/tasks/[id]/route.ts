import { NextRequest } from "next/server";
import { getAuthFromRequest, requireAuth } from "@/lib/auth";
import { taskUpdateSchema } from "@/lib/validations";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";
import * as taskService from "@/services/taskService";
import { logActivity } from "@/services/activityService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(getAuthFromRequest(request));
    const { id } = await params;

    const task = await taskService.getTaskById(
      id,
      auth.userId,
      auth.role === "admin"
    );

    if (!task) {
      return errorResponse("Task not found", 404);
    }

    return successResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(getAuthFromRequest(request));
    const { id } = await params;
    const body = await request.json();
    const parsed = taskUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    const { dueDate: dueDateRaw, ...rest } = parsed.data;
    const updateData: Record<string, unknown> = { ...rest };
    if (dueDateRaw !== undefined) {
      updateData.dueDate = dueDateRaw ? new Date(dueDateRaw) : undefined;
    }

    const task = await taskService.updateTask(
      id,
      updateData as Parameters<typeof taskService.updateTask>[1],
      auth.userId,
      auth.role === "admin"
    );

    if (!task) {
      return errorResponse("Task not found", 404);
    }

    await logActivity({
      action: "update",
      entity: "task",
      entityId: id,
      userId: auth.userId,
    });

    return successResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(getAuthFromRequest(request));
    const { id } = await params;

    const task = await taskService.deleteTask(
      id,
      auth.userId,
      auth.role === "admin"
    );

    if (!task) {
      return errorResponse("Task not found", 404);
    }

    await logActivity({
      action: "delete",
      entity: "task",
      entityId: id,
      userId: auth.userId,
    });

    return successResponse({ message: "Task deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
