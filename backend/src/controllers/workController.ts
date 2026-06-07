import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { finalizeImage, deleteImage } from "../utils/cloudinary.js";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

// Helper scan public_id dari markdown
const getPublicIds = (content: string) => {
  const regex = /res\.cloudinary\.com\/.*\/image\/upload\/v\d+\/([^\s)]+)/g;
  return [...content.matchAll(regex)].map((m) => {
    const raw = m[1];
    // Hilangkan ekstensi jika ada (.jpg, .png, dll)
    return raw.split(".")[0];
  });
};

export const getWorks = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const [works, totalWorks] = await Promise.all([
      prisma.work.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.work.count(),
    ]);

    const totalPages = Math.ceil(totalWorks / limit);

    // If authenticated (admin request), include the 'env' field.
    // Otherwise, omit it for public listings.
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    const isAuth = !!session;
    const sanitizedWorks = isAuth ? works : works.map(({ env, ...w }) => w);

    res.json({
      success: true,
      data: sanitizedWorks,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalWorks,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching works:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") return res.status(400).json({ message: "Invalid ID" });
    const work = await prisma.work.findUnique({
      where: { id },
    });
    if (!work) return res.status(404).json({ message: "Work not found" });

    // If authenticated (admin request), include the 'env' field.
    // Otherwise, omit it for public view.
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    const isAuth = !!session;
    if (isAuth) {
      return res.json(work);
    }

    const { env, ...sanitizedWork } = work;
    res.json(sanitizedWork);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createWork = async (req: Request, res: Response) => {
  try {
    let { name, description, images, stack, category, startDate, endDate, link_github, link_demo, status, env } = req.body;

    // Finalize multiple images from tmp to works
    if (Array.isArray(images) && images.length > 0) {
      images = await Promise.all(
        images.map(async (url: string) => {
          const ids = getPublicIds(url);
          if (ids.length > 0 && ids[0].startsWith("tmp/")) {
            const finalizedId = await finalizeImage(ids[0], "works");
            return url.replace(ids[0], finalizedId);
          }
          return url;
        }),
      );
    }

    // Finalize images in description (Markdown)
    if (description) {
      const descIds = getPublicIds(description);
      for (const id of descIds) {
        if (id.startsWith("tmp/")) {
          const finalizedId = await finalizeImage(id, "works");
          description = description.replace(id, finalizedId);
        }
      }
    }

    const work = await prisma.work.create({
      data: {
        name,
        description,
        images,
        stack: Array.isArray(stack) ? stack : [],
        category,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        link_github,
        link_demo,
        status,
        env,
      },
    });
    res.status(201).json(work);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateWork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") return res.status(400).json({ message: "Invalid ID" });

    let { name, description, images, stack, category, startDate, endDate, link_github, link_demo, status, env } = req.body;

    const oldWork = await prisma.work.findUnique({ where: { id } });
    if (!oldWork) return res.status(404).json({ message: "Work not found" });

    // 1. Handle images array lifecycle
    if (Array.isArray(images)) {
      // Finalize new images from tmp to works
      images = await Promise.all(
        images.map(async (url: string) => {
          const publicIds = getPublicIds(url);
          if (publicIds.length > 0 && publicIds[0].startsWith("tmp/")) {
            const finalizedId = await finalizeImage(publicIds[0], "works");
            return url.replace(publicIds[0], finalizedId);
          }
          return url;
        }),
      );
    }

    // 2. Handle description images
    if (description) {
      const newDescIds = getPublicIds(description);
      for (const pid of newDescIds) {
        if (pid.startsWith("tmp/")) {
          const finalizedId = await finalizeImage(pid, "works");
          description = description.replace(pid, finalizedId);
        }
      }
    }

    const work = await prisma.work.update({
      where: { id },
      data: {
        name,
        description,
        images,
        stack: Array.isArray(stack) ? stack : [],
        category,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        link_github,
        link_demo,
        status,
        env,
      },
    });
    res.json(work);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteWork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") return res.status(400).json({ message: "Invalid ID" });

    const work = await prisma.work.findUnique({ where: { id } });
    if (work) {
      // 1. Delete array of images
      if (Array.isArray(work.images)) {
        for (const url of work.images) {
          const pids = getPublicIds(url);
          for (const pid of pids) {
            await deleteImage(pid);
          }
        }
      }

      // 2. Delete description images (Markdown)
      if (work.description) {
        const descPids = getPublicIds(work.description);
        for (const pid of descPids) {
          await deleteImage(pid);
        }
      }
    }

    await prisma.work.delete({ where: { id } });
    res.json({ message: "Work deleted" });
  } catch (error) {
    console.error("Error deleting work:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
