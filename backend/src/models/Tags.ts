import mongoose, { Schema, Document } from "mongoose";

export interface ITags extends Document {
    tag_name: string;
    tag_slug: string;
    createdAt: Date;
}

const TagsSchema: Schema = new Schema({
    tag_name: {
        type: String,
        required: true,
        trim: true,
    },
    tag_slug: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<ITags>("Tags", TagsSchema);
