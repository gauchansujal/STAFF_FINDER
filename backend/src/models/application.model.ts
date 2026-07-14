import mongoose, { Schema, model, Document } from "mongoose";

export interface IApplication extends Document {
  userId:      mongoose.Types.ObjectId;
  vacancyId:   mongoose.Types.ObjectId; // ✅ changed from jobPostId
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
  vacancyId:   { type: Schema.Types.ObjectId, ref: "Vacancy", required: true }, // ✅
  fullName:    { type: String, required: true },
  email:       { type: String, required: true },
  phoneNumber: { type: String, required: true },
  coverLetter: { type: String, required: true },
  cvUrl:       { type: String, required: true },
  status:      { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

export const ApplicationModel = model<IApplication>("Application", applicationSchema);