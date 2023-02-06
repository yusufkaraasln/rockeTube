

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    favorites: string[];
    role: string;
}

export interface IUserModel extends IUser {
    // add custom methods for your model here
}

const UserSchema: Schema = new Schema({

    name: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }


}, { timestamps: true });


export default mongoose.model<IUserModel>("User", UserSchema);


