import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { generateSignature } from "../utils/cloudinary.js";
import { deleteFullMedia } from "../utils/mediaHelpers.js";

/**
 * Convert publicId to full Cloudinary URL
 */
const publicIdToUrl = (publicId: string): string => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("CLOUDINARY_CLOUD_NAME not configured");
  }
  const cleanId = publicId.replace(/\.(jpg|png|gif|webp)$/i, "");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${cleanId}`;
};

/**
 * GET /api/media/listmedia
 * List all media with pagination
 */
export const listMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const [media, totalItems] = await Promise.all([
      prisma.media.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.media.count(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    // Add url field to each media item
    const mediaWithUrls = media.map((m) => ({
      ...m,
      url: publicIdToUrl(m.publicId),
    }));

    res.json({
      media: mediaWithUrls,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error listing media:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/media/signature
 * Generate Cloudinary upload signature
 */
export const getSignature = async (req: Request, res: Response): Promise<void> => {
  try {
    const { public_id, folder = "media", status = "PENDING" } = req.body;

    // Generate signature for Cloudinary upload
    const timestamp = Math.round(new Date().getTime() / 1000);
    const { signature, apiKey, cloudName } = generateSignature(folder);

    // Create media record in database with PENDING status
    if (public_id) {
      await prisma.media.upsert({
        where: { publicId: `${folder}/${public_id}` },
        update: {
          status: status === "uploaded" ? "ACTIVE" : "PENDING",
          updatedAt: new Date(),
        },
        create: {
          publicId: `${folder}/${public_id}`,
          filename: public_id,
          status: status === "uploaded" ? "ACTIVE" : "PENDING",
        },
      });
    }

    res.json({
      timestamp,
      signature,
      api_key: apiKey,
      cloud_name: cloudName,
      folder,
      public_id,
    });
  } catch (error) {
    console.error("Error generating signature:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE /api/media/delete
 * Delete media from Cloudinary and database
 */
export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { public_id } = req.query;

    if (!public_id || typeof public_id !== "string") {
      res.status(400).json({ message: "public_id is required" });
      return;
    }

    const success = await deleteFullMedia(public_id);

    if (success) {
      res.json({ message: "Media deleted successfully" });
    } else {
      res.status(500).json({ message: "Failed to delete media" });
    }
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
