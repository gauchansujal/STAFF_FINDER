import mongoose, { Schema, model, Document } from 'mongoose';
import { type VacancyType } from '../types/vacancy.type';



const VacancySchema : Schema = new Schema<VacancyType>({
    RestaurantName:{
        type:String,
        required: true,
        unique: true,
        maxLength:100,

    },
    imageUrl:{
        type:String,
        required:false,
    },
    location:{
        type:String,
        required: true,
        

    },
    salary:{
        type:Number,
        required:true,
        min:0,
    },
    position:{
        type:String,
        required:true,
    },
    jobType:{
        type: String,
        enum: ["full-time", "part-time"],
        required: true,
        
    },
    description:{
        type:String,
        required:true,
    },
    applications:{
        type:Number,
        default:0,
    },
    
});

export interface IVacancy extends VacancyType, Document{
    //combine vacency and document
    id:mongoose.Types.ObjectId;//mongo related attributes/costome attribute
    createdAt: Date;
    updatedAt:Date;
}

export const VacancyModel = model<IVacancy>("Vaccency",VacancySchema)