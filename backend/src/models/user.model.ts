import mongoose, {Schema, model, Document} from 'mongoose';
import {  type UserType}  from "../types/user.types";

export interface Iuser extends UserType, Document{
    //combine usertype and document
    id:mongoose.Types.ObjectId;//mongo related attribute/costome attribute
    createdAt: Date;
    updatedAt:Date;

}

const userSchema : Schema<Iuser> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstname: {
        type: String,
        optional: true
    },
    lastname: {
        type: String,
        optional: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        optional: true,
        default: "user"
    },
    imageUrl: {
        type: String,
        optional: true
    }
}, {
    timestamps: true
});


export const UserModel = model<Iuser>("User", userSchema);

