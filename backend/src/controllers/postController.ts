import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { prisma } from "../lib/prisma.js";
import {
  extractPublicIdFromUrl,
  deleteFullMedia,
  extractCloudinaryUrlsFromContent,
  linkMediaToPost,
  linkMultipleMediaToPost,
} from "../utils/mediaHelpers.js";
import { finalizeImage } from "../utils/cloudinary.js";

// Helper scan public_id dari markdown
const getPublicIds = (content: string) => {
  const regex = /res\.cloudinary\.com\/.*\/image\/upload\/v\d+\/([^\s)]+)/g;
  return [...content.matchAll(regex)].map((m) => {
    const raw = m[1];
    // Hilangkan ekstensi jika ada (.jpg, .png, dll)
    return raw.split(".")[0];
  });
};

export const getPosts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit as string) || 10),
    );
    const skip = (page - 1) * limit;

    const search = (req.query.search as string) || "";
    const tagId = (req.query.tagId as string) || "";
    const tagName = (req.query.tagName as string) || "";

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tagId) {
      where.tagIds = { has: tagId };
    } else if (tagName) {
      const tag = await prisma.tag.findFirst({
        where: {
          OR: [
            { slug: { equals: tagName, mode: "insensitive" } },
            { name: { equals: tagName, mode: "insensitive" } },
          ],
        },
        select: { id: true },
      });

      if (!tag) {
        return void res.json({
          success: true,
          data: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: limit,
            hasNextPage: false,
            hasPrevPage: page > 1,
          },
          filters: {
            search: search || null,
            tagId: null,
          },
        });
      }

      where.tagIds = { has: tag.id };
    }

    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalPosts,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        search: search || null,
        tagId: tagId || null,
      },
    });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

export const getPost = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    let { title, description, content, thumbnail, tagIds, tagId, status } =
      req.body;

    const normalizedTagIds: string[] = Array.isArray(tagIds)
      ? tagIds
      : typeof tagId === "string"
        ? [tagId]
        : [];

    if (!title || !content || normalizedTagIds.length === 0) {
      return res
        .status(400)
        .json({ message: "title, content, and tagIds are required" });
    }

    if (
      !normalizedTagIds.every((t) => typeof t === "string" && t.trim() !== "")
    ) {
      return res
        .status(400)
        .json({ message: "tagIds must be an array of non-empty strings" });
    }

    const uniqueTagIds = Array.from(
      new Set(normalizedTagIds.map((t) => t.trim())),
    );

    if (status && !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      return res
        .status(400)
        .json({ message: "status must be DRAFT, PUBLISHED, or ARCHIVED" });
    }

    const existingTags = await prisma.tag.findMany({
      where: { id: { in: uniqueTagIds } },
      select: { id: true },
    });

    if (existingTags.length !== uniqueTagIds.length) {
      const found = new Set(existingTags.map((t) => t.id));
      const missing = uniqueTagIds.filter((id) => !found.has(id));
      return res
        .status(400)
        .json({ message: "Some tags not found", missingTagIds: missing });
    }

    // Finalize thumbnail from tmp to posts
    if (thumbnail) {
      const thumbIds = getPublicIds(thumbnail);
      if (thumbIds.length > 0 && thumbIds[0].startsWith("tmp/")) {
        const finalizedId = await finalizeImage(thumbIds[0], "posts");
        thumbnail = thumbnail.replace(thumbIds[0], finalizedId);
      }
    }

    // Finalize images in content (Markdown)
    if (content) {
      const contentIds = getPublicIds(content);
      for (const id of contentIds) {
        if (id.startsWith("tmp/")) {
          const finalizedId = await finalizeImage(id, "posts");
          content = content.replace(id, finalizedId);
        }
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        tagIds: uniqueTagIds,
        userId: req.user!.id,
        description: description ?? null,
        thumbnail: thumbnail ?? null,
        status: status ?? "DRAFT",
      },
    } as any);

    // Collect all media public IDs from thumbnail and content
    const publicIds = new Set<string>();

    if (thumbnail) {
      const publicId = extractPublicIdFromUrl(thumbnail);
      if (publicId) {
        publicIds.add(publicId);
      }
    }

    const contentUrls = extractCloudinaryUrlsFromContent(content);
    for (const url of contentUrls) {
      const publicId = extractPublicIdFromUrl(url);
      if (publicId) {
        publicIds.add(publicId);
      }
    }

    // Link media to post
    if (publicIds.size > 0) {
      const linkedCount = await linkMultipleMediaToPost(
        Array.from(publicIds),
        post.id,
      );
      console.log(`Linked ${linkedCount} media to post ${post.id}`);
    }

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    let { title, description, content, thumbnail, tagIds, tagId, status } =
      req.body;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== req.user!.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only edit your own posts" });
    }

    if (
      status !== undefined &&
      !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)
    ) {
      return res
        .status(400)
        .json({ message: "status must be DRAFT, PUBLISHED, or ARCHIVED" });
    }

    const tagIdsProvided = tagIds !== undefined || tagId !== undefined;
    const normalizedTagIds: string[] | undefined = tagIdsProvided
      ? Array.isArray(tagIds)
        ? tagIds
        : typeof tagId === "string"
          ? [tagId]
          : []
      : undefined;

    if (normalizedTagIds !== undefined) {
      if (normalizedTagIds.length === 0) {
        return res
          .status(400)
          .json({ message: "tagIds must contain at least one tag" });
      }
      if (
        !normalizedTagIds.every((t) => typeof t === "string" && t.trim() !== "")
      ) {
        return res
          .status(400)
          .json({ message: "tagIds must be an array of non-empty strings" });
      }

      const uniqueTagIds = Array.from(
        new Set(normalizedTagIds.map((t) => t.trim())),
      );
      const existingTags = await prisma.tag.findMany({
        where: { id: { in: uniqueTagIds } },
        select: { id: true },
      });

      if (existingTags.length !== uniqueTagIds.length) {
        const found = new Set(existingTags.map((t) => t.id));
        const missing = uniqueTagIds.filter((tid) => !found.has(tid));
        return res
          .status(400)
          .json({ message: "Some tags not found", missingTagIds: missing });
      }

      tagIds = uniqueTagIds;
    }

    // Finalize new thumbnail from tmp to posts
    if (thumbnail && thumbnail !== post.thumbnail) {
      const thumbIds = getPublicIds(thumbnail);
      if (thumbIds.length > 0 && thumbIds[0].startsWith("tmp/")) {
        const finalizedId = await finalizeImage(thumbIds[0], "posts");
        thumbnail = thumbnail.replace(thumbIds[0], finalizedId);
      }
    }

    // Finalize new content images (Markdown)
    if (content && content !== post.content) {
      const contentIds = getPublicIds(content);
      for (const pid of contentIds) {
        if (pid.startsWith("tmp/")) {
          const finalizedId = await finalizeImage(pid, "posts");
          content = content.replace(pid, finalizedId);
        }
      }
    }

    // Handle Media Lifecycle (Delete old, Link new)
    if (thumbnail !== undefined && thumbnail !== post.thumbnail) {
      if (post.thumbnail) {
        const oldThumbIds = getPublicIds(post.thumbnail);
        if (oldThumbIds.length > 0) {
          await deleteFullMedia(oldThumbIds[0]);
        }
      }

      if (thumbnail) {
        const newThumbIds = getPublicIds(thumbnail);
        if (newThumbIds.length > 0) {
          await linkMediaToPost(newThumbIds[0], post.id);
        }
      }
    }

    if (content !== undefined && content !== post.content) {
      const oldUrls = extractCloudinaryUrlsFromContent(post.content);
      const newUrls = extractCloudinaryUrlsFromContent(content);

      const removedUrls = oldUrls.filter((url) => !newUrls.includes(url));
      for (const url of removedUrls) {
        const pids = getPublicIds(url);
        if (pids.length > 0) {
          await deleteFullMedia(pids[0]);
        }
      }

      const addedUrls = newUrls.filter((url) => !oldUrls.includes(url));
      const addedPublicIds = addedUrls
        .map((url) => {
          const pids = getPublicIds(url);
          return pids.length > 0 ? pids[0] : null;
        })
        .filter((pid): pid is string => Boolean(pid));

      if (addedPublicIds.length > 0) {
        await linkMultipleMediaToPost(addedPublicIds, post.id);
      }
    }

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (tagIds !== undefined) updateData.tagIds = tagIds;
    if (status !== undefined) updateData.status = status;

    const updatedPost = await (prisma.post as any).update({
      where: { id },
      data: updateData,
    });

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== req.user!.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only delete your own posts" });
    }

    if (post.thumbnail) {
      const oldThumbIds = getPublicIds(post.thumbnail);
      if (oldThumbIds.length > 0) {
        await deleteFullMedia(oldThumbIds[0]);
      }
    }

    const contentIds = getPublicIds(post.content);
    for (const pid of contentIds) {
      await deleteFullMedia(pid);
    }

    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
};
