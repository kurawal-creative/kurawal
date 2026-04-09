import mongoose, { Schema, Document } from "mongoose";

export interface IEnv extends Document {
  title: string;
  description: string;
  link_github: string;
  env: IEnvVar[]; // Fix: Match dengan schema (array, bukan string)
  createdAt: Date;
  updatedAt: Date;
}

export interface IEnvVar {
  key: string;
  value: string;
  env_description: string;
  optional?: boolean;
  sensitive?: boolean;
}

// Sub-schema untuk env vars (tanpa _id biar clean)
const EnvVarSchema: Schema = new Schema({
  key: {
    type: String,
  },
  value: {
    type: String,
  },
  env_description: {
    type: String,
  },
  optional: {
    type: Boolean,
    default: false,
  },
  sensitive: {
    type: Boolean,
    default: false,
  },
}, { _id: false }); // Tambah ini: Hindari _id di sub-doc

const EnvSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true, // Bisa hapus kalau pure controller
      unique: true, // Ini udah bikin index otomatis
    },
    description: {
      type: String,
      required: true, // Bisa hapus kalau pure controller
    },
    link_github: {
      type: String,
      required: true, // Bisa hapus kalau pure controller
    },
    env: {
      type: [EnvVarSchema],
      required: true, // Bisa hapus kalau pure controller
    },
  },
  {
    timestamps: true,
  }
);

// Hapus index title (duplikat), cuma biarin yang lain
EnvSchema.index({ "env.key": 1 });

export default mongoose.model<IEnv>("Envs", EnvSchema);