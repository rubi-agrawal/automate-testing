import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest, requireAuth, requireAdmin } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";
import BugReport from "@/models/BugReport";
import { Types } from "mongoose";
import { z } from "zod";

const updateBugSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed", "wont_fix"]).optional(),
  severity: z.enum(["low", "medium", "high", "critical"]).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(getAuthFromRequest(request));
    const { id } = await params;
    await connectDB();

    const filter: Record<string, unknown> = { _id: id };
    if (auth.role !== "admin") {
      filter.reportedBy = new Types.ObjectId(auth.userId);
    }

    const bug = await BugReport.findOne(filter).populate("reportedBy", "name email");
    if (!bug) return errorResponse("Bug report not found", 404);

    return successResponse(bug);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = getAuthFromRequest(request);
    const { id } = await params;
    const body = await request.json();
    const parsed = updateBugSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();

    const filter: Record<string, unknown> = { _id: id };
    if (auth?.role !== "admin") {
      requireAuth(auth);
      filter.reportedBy = new Types.ObjectId(auth!.userId);
    } else {
      requireAdmin(auth);
    }

    const bug = await BugReport.findOneAndUpdate(filter, parsed.data, {
      new: true,
    }).populate("reportedBy", "name email");

    if (!bug) return errorResponse("Bug report not found", 404);
    return successResponse(bug);
  } catch (error) {
    return handleApiError(error);
  }
}
