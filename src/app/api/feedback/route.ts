import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest, requireAuth } from "@/lib/auth";
import { feedbackSchema, paginationSchema } from "@/lib/validations";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";
import Feedback from "@/models/Feedback";
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
    });

    const page = query.success ? query.data.page : 1;
    const limit = query.success ? query.data.limit : 10;
    const skip = (page - 1) * limit;

    const filter =
      auth.role === "admin"
        ? {}
        : { userId: new Types.ObjectId(auth.userId) };

    const [feedbacks, total, avgRating] = await Promise.all([
      Feedback.find(filter)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Feedback.countDocuments(filter),
      Feedback.aggregate([
        { $match: filter },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
    ]);

    return successResponse({
      feedbacks,
      averageRating: avgRating[0]?.avg || 0,
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
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    const feedback = await Feedback.create({
      ...parsed.data,
      userId: new Types.ObjectId(auth.userId),
    });

    await logActivity({
      action: "create",
      entity: "feedback",
      entityId: feedback._id.toString(),
      userId: auth.userId,
    });

    return successResponse(feedback, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
