import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest, requireAuth, requireAdmin } from "@/lib/auth";
import { successResponse, handleApiError } from "@/lib/api-response";
import ActivityLog from "@/models/ActivityLog";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(getAuthFromRequest(request));
    requireAdmin(auth);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const logs = await ActivityLog.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return successResponse(logs);
  } catch (error) {
    return handleApiError(error);
  }
}
