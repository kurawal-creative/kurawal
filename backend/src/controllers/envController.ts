import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { prisma } from "../lib/prisma.js";
import validator from "validator";

export const getEnvs = async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || "1"));
    const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) || "10")));
    const skip = (page - 1) * limit;

    const [envs, totalItems] = await Promise.all([
      prisma.env.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.env.count(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      data: envs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching envs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch environments",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getEnv = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Environment ID is required",
      });
    }

    const env = await prisma.env.findUnique({
      where: { id },
    });

    if (!env) {
      return res.status(404).json({
        success: false,
        message: "Environment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: env,
    });
  } catch (error) {
    console.error("Error fetching env:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch environment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createEnv = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, link_github, env: envArray } = req.body;

    if (!title || !description || !link_github || !envArray || !Array.isArray(envArray) || envArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, including at least one environment variable",
      });
    }

    if (title.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Title must be at most 100 characters",
      });
    }

    if (description.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Description must be at most 500 characters",
      });
    }

    if (!validator.isURL(link_github.trim(), { require_protocol: true })) {
      return res.status(400).json({
        success: false,
        message: "link_github must be a valid URL",
      });
    }

    for (const item of envArray) {
      if (!item.key || typeof item.key !== "string" || !item.value || typeof item.value !== "string" || !item.env_description || typeof item.env_description !== "string") {
        return res.status(400).json({
          success: false,
          message: "Each environment variable must have 'key', 'value', and 'env_description'",
        });
      }

      if (item.key.trim().length > 50) {
        return res.status(400).json({
          success: false,
          message: "Each env key must be at most 50 characters",
        });
      }
    }

    const keys = envArray.map((item: any) => item.key);
    const uniqueKeys = new Set(keys);
    if (uniqueKeys.size !== keys.length) {
      return res.status(400).json({
        success: false,
        message: "Environment variable keys must be unique",
      });
    }

    const existingEnv = await prisma.env.findUnique({
      where: { title: title.trim() },
    });

    if (existingEnv) {
      return res.status(409).json({
        success: false,
        message: `Environment with title '${title}' already exists`,
      });
    }

    const environment = await prisma.env.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        link_github: link_github.trim(),
        env: envArray.map((item: any) => ({
          key: item.key.trim(),
          value: item.value.trim(),
          env_description: item.env_description.trim(),
          optional: item.optional ?? false,
          sensitive: item.sensitive ?? false,
        })),
      },
    });

    res.status(201).json({
      success: true,
      data: environment,
    });
  } catch (error) {
    console.error("Error creating env:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create environment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateEnv = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, link_github, env: envArray } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Environment ID is required",
      });
    }

    if (!title && !description && !link_github && (!envArray || envArray.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided for update",
      });
    }

    const existingEnv = await prisma.env.findUnique({
      where: { id },
    });

    if (!existingEnv) {
      return res.status(404).json({
        success: false,
        message: "Environment not found",
      });
    }

    if (title !== undefined) {
      if (title.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: "Title must be at most 100 characters",
        });
      }

      if (title.trim() !== existingEnv.title) {
        const duplicate = await prisma.env.findUnique({
          where: { title: title.trim() },
        });

        if (duplicate) {
          return res.status(409).json({
            success: false,
            message: `Environment with title '${title}' already exists`,
          });
        }
      }
    }

    if (description !== undefined) {
      if (description.trim().length > 500) {
        return res.status(400).json({
          success: false,
          message: "Description must be at most 500 characters",
        });
      }
    }

    if (link_github !== undefined) {
      if (!validator.isURL(link_github.trim(), { require_protocol: true })) {
        return res.status(400).json({
          success: false,
          message: "link_github must be a valid URL",
        });
      }
    }

    if (envArray !== undefined) {
      if (!Array.isArray(envArray) || envArray.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Environment array must be non-empty if provided",
        });
      }

      for (const item of envArray) {
        if (!item.key || typeof item.key !== "string" || !item.value || typeof item.value !== "string" || !item.env_description || typeof item.env_description !== "string") {
          return res.status(400).json({
            success: false,
            message: "Each environment variable must have 'key', 'value', and 'env_description'",
          });
        }

        if (item.key.trim().length > 50) {
          return res.status(400).json({
            success: false,
            message: "Each env key must be at most 50 characters",
          });
        }
      }

      const keys = envArray.map((item: any) => item.key);
      const uniqueKeys = new Set(keys);
      if (uniqueKeys.size !== keys.length) {
        return res.status(400).json({
          success: false,
          message: "Environment variable keys must be unique",
        });
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (link_github !== undefined) updateData.link_github = link_github.trim();
    if (envArray !== undefined) {
      updateData.env = envArray.map((item: any) => ({
        key: item.key.trim(),
        value: item.value.trim(),
        env_description: item.env_description.trim(),
        optional: item.optional ?? false,
        sensitive: item.sensitive ?? false,
      }));
    }

    const updatedEnv = await prisma.env.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: updatedEnv,
    });
  } catch (error) {
    console.error("Error updating env:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update environment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteEnv = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Environment ID is required",
      });
    }

    const deletedEnv = await prisma.env.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Environment deleted successfully",
      data: { id: deletedEnv.id, title: deletedEnv.title },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return res.status(404).json({
        success: false,
        message: "Environment not found",
      });
    }

    console.error("Error deleting env:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete environment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
