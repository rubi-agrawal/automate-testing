import Task, { type ITask } from "@/models/Task";
import { connectDB } from "@/lib/db";
import { Types, type FilterQuery } from "mongoose";

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  priority?: string;
  userId?: string;
  isAdmin?: boolean;
}

export async function getTasks(params: TaskQueryParams) {
  await connectDB();

  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const filter: FilterQuery<ITask> = {};

  if (!params.isAdmin && params.userId) {
    filter.createdBy = new Types.ObjectId(params.userId);
  }

  if (params.status) {
    filter.status = params.status;
  }

  if (params.priority) {
    filter.priority = params.priority;
  }

  if (params.search) {
    filter.$or = [
      { title: { $regex: params.search, $options: "i" } },
      { description: { $regex: params.search, $options: "i" } },
    ];
  }

  const sortField = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder === "asc" ? 1 : -1;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("createdBy", "name email")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTaskById(id: string, userId?: string, isAdmin = false) {
  await connectDB();
  const filter: FilterQuery<ITask> = { _id: id };
  if (!isAdmin && userId) {
    filter.createdBy = new Types.ObjectId(userId);
  }
  return Task.findOne(filter).populate("createdBy", "name email");
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: Date;
  createdBy: string;
}

export async function createTask(data: CreateTaskInput) {
  await connectDB();
  return Task.create({
    title: data.title,
    description: data.description ?? "",
    priority: data.priority ?? "medium",
    status: data.status ?? "todo",
    dueDate: data.dueDate,
    createdBy: new Types.ObjectId(data.createdBy),
  });
}

export async function updateTask(
  id: string,
  data: Partial<ITask>,
  userId?: string,
  isAdmin = false
) {
  await connectDB();
  const filter: FilterQuery<ITask> = { _id: id };
  if (!isAdmin && userId) {
    filter.createdBy = new Types.ObjectId(userId);
  }
  return Task.findOneAndUpdate(filter, data, { new: true }).populate(
    "createdBy",
    "name email"
  );
}

export async function deleteTask(
  id: string,
  userId?: string,
  isAdmin = false
) {
  await connectDB();
  const filter: FilterQuery<ITask> = { _id: id };
  if (!isAdmin && userId) {
    filter.createdBy = new Types.ObjectId(userId);
  }
  return Task.findOneAndDelete(filter);
}

export async function getTaskStats(userId?: string, isAdmin = false) {
  await connectDB();
  const match: FilterQuery<ITask> = {};
  if (!isAdmin && userId) {
    match.createdBy = new Types.ObjectId(userId);
  }

  const stats = await Task.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const total = await Task.countDocuments(match);
  const byPriority = await Task.aggregate([
    { $match: match },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  return { stats, total, byPriority };
}
