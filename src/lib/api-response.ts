import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400, errors?: unknown) {
  return NextResponse.json(
    { success: false, message, errors },
    { status }
  );
}

export function handleApiError(error: unknown) {
  console.error("[API Error]", error);
  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }
    if (error.message.startsWith("Forbidden")) {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message, 400);
  }
  return errorResponse("Internal server error", 500);
}
