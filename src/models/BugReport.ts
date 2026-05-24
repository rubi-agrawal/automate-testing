import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type BugSeverity = "low" | "medium" | "high" | "critical";
export type BugStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed"
  | "wont_fix";

export interface IBugReport extends Document {
  title: string;
  description: string;
  severity: BugSeverity;
  status: BugStatus;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  reportedBy: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BugReportSchema = new Schema<IBugReport>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed", "wont_fix"],
      default: "open",
    },
    stepsToReproduce: { type: String },
    expectedBehavior: { type: String },
    actualBehavior: { type: String },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

BugReportSchema.index({ status: 1, severity: 1 });

const BugReport: Model<IBugReport> =
  mongoose.models.BugReport ||
  mongoose.model<IBugReport>("BugReport", BugReportSchema);

export default BugReport;
