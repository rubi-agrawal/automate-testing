import ActivityLog from "@/models/ActivityLog";
import { connectDB } from "@/lib/db";
import { Types } from "mongoose";

export async function logActivity(params: {
  action: string;
  entity: string;
  entityId?: string;
  userId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}) {
  await connectDB();
  await ActivityLog.create({
    action: params.action,
    entity: params.entity,
    entityId: params.entityId ? new Types.ObjectId(params.entityId) : undefined,
    userId: new Types.ObjectId(params.userId),
    metadata: params.metadata,
    ipAddress: params.ipAddress,
  });
}
