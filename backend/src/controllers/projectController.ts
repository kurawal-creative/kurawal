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
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (error) {
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
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    let { name, description, image, link_github, link_demo, status, env } = req.body;

    // Handle thumbnail image
    if (image) {
      const projectIds = getPublicIds(image);
      if (projectIds.length > 0) {
        const id = projectIds[0];
        if (id.startsWith("tmp/")) {
          const finalizedId = await finalizeImage(id, "projects");
          image = image.replace(id, finalizedId);
        }
      }
    }

    // Handle images in description (Markdown)
    if (description) {
      const projectIds = getPublicIds(description);
      for (const id of projectIds) {
        if (id.startsWith("tmp/")) {
          const finalizedId = await finalizeImage(id, "projects");
          description = description.replace(id, finalizedId);
        }
      }
    }

    const project = await prisma.project.create({
      data: { name, description, image, link_github, link_demo, status, env },
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

    const oldProject = await prisma.project.findUnique({ where: { id } });
    if (!oldProject) return res.status(404).json({ message: "Project not found" });

    let { name, description, image, link_github, link_demo, status, env } = req.body;

    // 0. Handle thumbnail image lifecycle
    if (oldProject.image !== image) {
      // Delete old thumbnail if it exists
      if (oldProject.image) {
        const oldThumbId = getPublicIds(oldProject.image)[0];
        if (oldThumbId) {
          try {
            await deleteImage(oldThumbId);
          } catch (err) {
            console.error(`Failed to delete old thumbnail ${oldThumbId}`, err);
          }
        }
      }

      // Finalize new thumbnail if it's in tmp
      if (image) {
        const newThumbIds = getPublicIds(image);
        if (newThumbIds.length > 0) {
          const nId = newThumbIds[0];
          if (nId.startsWith("tmp/")) {
            const finalizedId = await finalizeImage(nId, "projects");
            image = image.replace(nId, finalizedId);
          }
        }
      }
    }

    // Lifecycle management untuk gambar di Markdown
    const oldIds = getPublicIds(oldProject.description || "");
    const newIds = getPublicIds(description || "");

    // 1. Hapus gambar yang dihilangkan dari markdown
    const deletedIds = oldIds.filter((x) => !newIds.includes(x));
    for (const dId of deletedIds) {
      try {
        await deleteImage(dId);
      } catch (err) {
        console.error(`Failed to delete image ${dId}`, err);
      }
    }

    // 2. Pindahkan gambar baru (tmp) ke permanent (projects) & update content string
    if (description) {
      for (const nId of newIds) {
        if (nId.startsWith("tmp/")) {
          const finalizedId = await finalizeImage(nId, "projects");
          description = description.replace(nId, finalizedId);
        }
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: { name, description, image, link_github, link_demo, status, env },
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
      // Hapus semua gambar terkait di markdown sebelum hapus project
      const ids = getPublicIds(project.description || "");
      for (const imgId of ids) {
        await deleteImage(imgId);
      }
      // Hapus juga thumbnail utama jika ada
      if (project.image) {
        const thumbId = getPublicIds(project.image)[0] || project.image.split("/").pop()?.split(".")[0];
        if (thumbId) await deleteImage(thumbId);
      }
    }

    await prisma.project.delete({
      where: { id },
    });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
