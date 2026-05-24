import { NextRequest } from "next/server";
import { getAuthFromRequest, requireAuth } from "@/lib/auth";
import { successResponse, handleApiError } from "@/lib/api-response";
import {
  getAdminDashboardStats,
  getUserDashboardStats,
} from "@/services/dashboardService";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(getAuthFromRequest(request));

    const stats =
      auth.role === "admin"
        ? await getAdminDashboardStats()
        : await getUserDashboardStats(auth.userId);

    return successResponse(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
