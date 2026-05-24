import { connectDB } from "@/lib/db";
import { Types } from "mongoose";
import User from "@/models/User";
import Task from "@/models/Task";
import BugReport from "@/models/BugReport";
import Feedback from "@/models/Feedback";

export async function getAdminDashboardStats() {
  await connectDB();

  const [
    totalUsers,
    totalTasks,
    totalBugs,
    totalFeedback,
    taskByStatus,
    bugsBySeverity,
    recentTasks,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Task.countDocuments(),
    BugReport.countDocuments(),
    Feedback.countDocuments(),
    Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    BugReport.aggregate([
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]),
    Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("createdBy", "name")
      .lean(),
  ]);

  const openBugs = await BugReport.countDocuments({
    status: { $in: ["open", "in_progress"] },
  });

  return {
    totalUsers,
    totalTasks,
    totalBugs,
    openBugs,
    totalFeedback,
    taskByStatus,
    bugsBySeverity,
    recentTasks,
    testCoverage: {
      unit: 85,
      integration: 78,
      e2e: 72,
      overall: 78,
    },
  };
}

export async function getUserDashboardStats(userId: string) {
  await connectDB();

  const userObjectId = new Types.ObjectId(userId);

  const [myTasks, tasksByStatus, myBugs, myFeedback] = await Promise.all([
    Task.countDocuments({ createdBy: userObjectId }),
    Task.aggregate([
      { $match: { createdBy: userObjectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    BugReport.countDocuments({ reportedBy: userObjectId }),
    Feedback.countDocuments({ userId: userObjectId }),
  ]);

  const recentTasks = await Task.find({ createdBy: userObjectId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return {
    myTasks,
    tasksByStatus,
    myBugs,
    myFeedback,
    recentTasks,
  };
}
