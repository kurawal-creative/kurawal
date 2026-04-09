import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    nama: string;
    email: string;
    password: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    nama: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IUser>("User", UserSchema);
