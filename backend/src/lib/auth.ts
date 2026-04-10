import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { openAPI } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
import cloudinary from "../utils/cloudinary.js";

const prisma = new PrismaClient();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:5173",
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  databaseHooks: {
    user: {
      update: {
        before: async (data, ctx) => {
          const img = data.image;
          const session = ctx?.context.session;
          if (typeof img !== "string" || !img.includes("/tmp/")) return { data };

          const getPid = (u: string) => u.match(/tmp\/[^.]+/)?.[0];
          const source = getPid(img);
          const dest = `avatars/user-${session?.user.id}`;

          if (source) {
            try {
              // 1. Rename (Move) - otomatis menimpa file lama di folder avatars
              const res = await cloudinary.uploader.rename(source, dest, {
                overwrite: true,
              });
              data.image = res.secure_url;
            } catch (e) {
              console.error("Cloudinary Move Failed:", e);
            }
          }
          return { data };
        },
      },
    },
  },
  plugins: [openAPI(), admin()],
});
