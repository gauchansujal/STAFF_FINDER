import mongoose, { Schema, model, Document } from "mongoose";

export interface IJobPost extends Document {
  imageUrl?:      string;
  position:       string;
  RestaurantName: string;
  salary:         number;
  location:       string;
  jobType:        "full-time" | "part-time";
  description:    string;
  requirements:   string[];
  applications:   number;
  createdAt:      Date;
  updatedAt:      Date;
}

const jobPostSchema = new Schema<IJobPost>({
  imageUrl:       { type: String },
  position:       { type: String, required: true },
  RestaurantName: { type: String, required: true },
  salary:         { type: Number, required: true },
  location:       { type: String, required: true },
  jobType:        { type: String, enum: ["full-time", "part-time"], required: true },
  description:    { type: String, required: true },
  requirements:   [{ type: String }],
  applications:   { type: Number, default: 0 },
}, { timestamps: true });

export const JobPostModel = model<IJobPost>("JobPost", jobPostSchema);