import mongoose, { Schema, model, Document } from "mongoose";

export interface IApplication extends Document {
  userId:          mongoose.Types.ObjectId;
  vacancyId:       mongoose.Types.ObjectId;
  // vacancy snapshot
  imageUrl?:       string;
  position:        string;
  RestaurantName:  string;
  salary:          number;
  location:        string;
  jobType:         "full-time" | "part-time";
  description:     string;
  requirements:    string[];
  // application status
  status:          "pending" | "accepted" | "rejected";
  createdAt:       Date;
  updatedAt:       Date;
}

const applicationSchema = new Schema<IApplication>({
  userId:         { type: Schema.Types.ObjectId, ref: "User",    required: true },
  vacancyId:      { type: Schema.Types.ObjectId, ref: "Vacancy", required: true },
  imageUrl:       { type: String },
  position:       { type: String, required: true },
  RestaurantName: { type: String, required: true },
  salary:         { type: Number, required: true },
  location:       { type: String, required: true },
  jobType:        { type: String, enum: ["full-time", "part-time"], required: true },
  description:    { type: String, required: true },
  requirements:   [{ type: String }],
  status:         { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

export const ApplicationModel = model<IApplication>("Application", applicationSchema);