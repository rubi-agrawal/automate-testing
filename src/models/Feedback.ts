import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type FeedbackCategory =
  | "usability"
  | "performance"
  | "feature"
  | "bug"
  | "other";

export interface IFeedback extends Document {
  rating: number;
  category: FeedbackCategory;
  message: string;
  suggestions?: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    category: {
      type: String,
      enum: ["usability", "performance", "feature", "bug", "other"],
      required: true,
    },
    message: { type: String, required: true },
    suggestions: { type: String },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;
