import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { finalizeImage, deleteImage } from "../utils/cloudinary.js";

// Helper scan public_id dari markdown
const getPublicIds = (content: string) => {
  const regex = /res\.cloudinary\.com\/.*\/image\/upload\/v\d+\/([^\s)]+)/g;
  return [...content.matchAll(regex)].map((m) => {
    const raw = m[1];
    // Hilangkan ekstensi jika ada (.jpg, .png, dll)
    return raw.split(".")[0];
  });
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const [projects, totalProjects] = await Promise.all([
      prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.project.count(),
    ]);

    const totalPages = Math.ceil(totalProjects / limit);

    // If authenticated (admin request), include the 'env' field.
    // Otherwise, omit it for public listings.
    const isAuth = !!(req as any).user;
    const sanitizedProjects = isAuth ? projects : projects.map(({ env, ...p }) => p);

    res.json({
      success: true,
      data: sanitizedProjects,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalProjects,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") return res.status(400).json({ message: "Invalid ID" });
    const project = await prisma.project.findUnique({
      where: { id },
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    // If authenticated (admin request), include the 'env' field.
    // Otherwise, omit it for public view.
    const isAuth = !!(req as any).user;
    if (isAuth) {
      return res.json(project);
    }

    const { env, ...sanitizedProject } = project as any;
    res.json(sanitizedProject);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    let { name, description, images, stack, startDate, endDate, link_github, link_demo, status, env } = req.body;

    // Finalize multiple images from tmp to projects
    if (Array.isArray(images) && images.length > 0) {
      images = await Promise.all(
        images.map(async (url: string) => {
          const ids = getPublicIds(url);
          if (ids.length > 0 && ids[0].startsWith("tmp/")) {
            const finalizedId = await finalizeImage(ids[0], "projects");
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
          const finalizedId = await finalizeImage(id, "projects");
          description = description.replace(id, finalizedId);
        }
      }
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        images,
        stack: Array.isArray(stack) ? stack : [],
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        link_github,
        link_demo,
        status,
        env,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") return res.status(400).json({ message: "Invalid ID" });

    let { name, description, images, stack, startDate, endDate, link_github, link_demo, status, env } = req.body;

    const oldProject = await prisma.project.findUnique({ where: { id } });
    if (!oldProject) return res.status(404).json({ message: "Project not found" });

    // 1. Handle images array lifecycle
    if (Array.isArray(images)) {
      // Finalize new images from tmp to projects
      images = await Promise.all(
        images.map(async (url: string) => {
          const publicIds = getPublicIds(url);
          if (publicIds.length > 0 && publicIds[0].startsWith("tmp/")) {
            const finalizedId = await finalizeImage(publicIds[0], "projects");
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
          const finalizedId = await finalizeImage(pid, "projects");
          description = description.replace(pid, finalizedId);
        }
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        images,
        stack: Array.isArray(stack) ? stack : [],
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        link_github,
        link_demo,
        status,
        env,
      },
    });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") return res.status(400).json({ message: "Invalid ID" });

    const project = await prisma.project.findUnique({ where: { id } });
    if (project) {
      // 1. Delete array of images
      if (Array.isArray(project.images)) {
        for (const url of project.images) {
          const pids = getPublicIds(url);
          for (const pid of pids) {
            await deleteImage(pid);
          }
        }
      }

      // 2. Delete description images (Markdown)
      if (project.description) {
        const descPids = getPublicIds(project.description);
        for (const pid of descPids) {
          await deleteImage(pid);
        }
      }
    }

    await prisma.project.delete({ where: { id } });
    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
