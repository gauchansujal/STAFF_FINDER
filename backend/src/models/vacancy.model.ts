import mongoose, { Schema, model, Document } from 'mongoose';
import { type VacancyType } from '../types/vacancy.type';

const VacancySchema: Schema = new Schema<VacancyType>({
  RestaurantName: {
    type:      String,
    required:  true,
    maxLength: 100,
  },
  imageUrl: {
    type:     String,
    required: false,
  },
  location: {
    type:     String,
    required: true,
  },
  salary: {
    type:     Number,
    required: true,
    min:      0,
  },
  position: {
    type:     String,
    required: true,
  },
  jobType: {
    type:     String,
    enum:     ["full-time", "part-time"],
    required: true,
  },
  description: {
    type:     String,
    required: true,
  },
  requirements: [{
    type: String,
  }],
  applications: {
    type:    Number,
    default: 0,
  },
}, { timestamps: true });

export interface IVacancy extends VacancyType, Document {
  id:        mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const VacancyModel = model<IVacancy>("Vacancy", VacancySchema);