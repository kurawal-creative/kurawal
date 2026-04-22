import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { auth } from "../src/lib/auth.js";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "test@example.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Amikom123";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "Admin";

async function main() {
  try {
    console.log("Starting seed...");

    const existingUser = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    let userId: string;

    if (!existingUser) {
      const res = await auth.api.signUpEmail({
        body: {
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        },
      });

      if (!res?.user?.id) {
        throw new Error("Failed to create user via auth API");
      }

      userId = res.user.id;

      console.log("Admin user created");
      console.log("Email:", ADMIN_EMAIL);
      console.log("User ID:", userId);
    } else {
      console.log("Admin already exists");
      userId = existingUser.id;
    }

    const elevatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: "admin",
        banned: false,
        banReason: null,
        banExpires: null,
      },
    });

    console.log("Admin role ensured:", elevatedUser.role);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
