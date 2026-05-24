import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest, requireAuth } from "@/lib/auth";
import { bugReportSchema, paginationSchema } from "@/lib/validations";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";
import BugReport from "@/models/BugReport";
import { Types } from "mongoose";
import { logActivity } from "@/services/activityService";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(getAuthFromRequest(request));
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = paginationSchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
      status: searchParams.get("status") || undefined,
    });

    if (!query.success) {
      return errorResponse("Invalid query parameters", 400);
    }

    const { page, limit, search, sortBy, sortOrder, status } = query.data;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (auth.role !== "admin") {
      filter.reportedBy = new Types.ObjectId(auth.userId);
    }
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortField = sortBy || "createdAt";
    const sortDir = sortOrder === "asc" ? 1 : -1;

    const [bugs, total] = await Promise.all([
      BugReport.find(filter)
        .populate("reportedBy", "name email")
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit)
        .lean(),
      BugReport.countDocuments(filter),
    ]);

    return successResponse({
      bugs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(getAuthFromRequest(request));
    const body = await request.json();
    const parsed = bugReportSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    const bug = await BugReport.create({
      ...parsed.data,
      reportedBy: new Types.ObjectId(auth.userId),
    });

    await logActivity({
      action: "create",
      entity: "bug",
      entityId: bug._id.toString(),
      userId: auth.userId,
    });

    return successResponse(bug, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
