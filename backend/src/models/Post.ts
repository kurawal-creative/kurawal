import mongoose, { Schema, Document, Types } from "mongoose"; // Tambah Types buat ObjectId

export interface IPost extends Document {
    title: string;
    description: string;
    type_post: string;
    link_github: string;
    tech_stack: string[];
    content: string;
    authorId: Types.ObjectId; // Ubah ke ObjectId kalau ref ke User (atau tetep string kalau nggak)
    tags: Types.ObjectId[]; // <-- Fix: Array ObjectId, match schema
    createdAt: Date;
    updatedAt?: Date; // Bonus: Kalau pake timestamps
}

const PostSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        type_post: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        link_github: {
            type: String,
            required: true,
        },
        tech_stack: {
            type: [String],
            required: true,
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId, // Ubah ke ObjectId kalau ref ke User
            ref: 'User', // Asumsi nama model User
            required: true,
        },
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tags' }], // Udah bener
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Otomatis createdAt & updatedAt
    }
);

export default mongoose.model<IPost>("Posts", PostSchema);