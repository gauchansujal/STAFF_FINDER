import mongoose, { Schema, model, Document } from "mongoose";

export interface IApplication extends Document {
  userId:      mongoose.Types.ObjectId;
  jobPostId:   mongoose.Types.ObjectId;
  fullName:    string;
  email:       string;
  phoneNumber: string;
  coverLetter: string;
  cvUrl:       string;
  status:      "pending" | "accepted" | "rejected";
  createdAt:   Date;
  updatedAt:   Date;
}

const applicationSchema = new Schema<IApplication>({
  userId:      { type: Schema.Types.ObjectId, ref: "User",    required: true },
  jobPostId:   { type: Schema.Types.ObjectId, ref: "JobPost", required: true },
  fullName:    { type: String, required: true },
  email:       { type: String, required: true },
  phoneNumber: { type: String, required: true },
  coverLetter: { type: String, required: true },
  cvUrl:       { type: String, required: true },
  status:      { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

export const ApplicationModel = model<IApplication>("Application", applicationSchema);