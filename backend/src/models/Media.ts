import mongoose, { Document, Schema } from "mongoose";

export interface IMedia extends Document { 
    publicId: string;
    status: string;
    filename: string;
    createdAt: Date;
}

const MediaSchema: Schema = new Schema({
    publicId: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "uploaded"],
        default: "pending",
    },
    filename: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IMedia>("Media", MediaSchema);