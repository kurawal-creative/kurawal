import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { prisma } from "../lib/prisma.js";
import { extractPublicIdFromUrl, deleteFullMedia, extractCloudinaryUrlsFromContent, linkMediaToPost, linkMultipleMediaToPost } from "../utils/mediaHelpers.js";
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

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const search = (req.query.search as string) || "";
    const tagId = (req.query.tagId as string) || "";
    const tagName = (req.query.tagName as string) || "";

    const where: any = {};

    if (search) {
      where.OR = [{ title: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }];
    }

    if (tagId) {
      where.tagId = tagId;
    } else if (tagName) {
      where.tag = {
        name: { equals: tagName, mode: "insensitive" },
      };
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
    let { title, description, content, thumbnail, tagId, status } = req.body;

    if (!title || !content || !tagId) {
      return res.status(400).json({ message: "title, content, and tagId are required" });
    }

    if (status && !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      return res.status(400).json({ message: "status must be DRAFT, PUBLISHED, or ARCHIVED" });
    }

    const existingTag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!existingTag) {
      return res.status(400).json({ message: "Tag not found" });
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
        tagId,
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
      const linkedCount = await linkMultipleMediaToPost(Array.from(publicIds), post.id);
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
    let { title, description, content, thumbnail, tagId, status } = req.body;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== req.user!.id) {
      return res.status(403).json({ message: "Unauthorized: You can only edit your own posts" });
    }

    if (status !== undefined && !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      return res.status(400).json({ message: "status must be DRAFT, PUBLISHED, or ARCHIVED" });
    }

    if (tagId !== undefined) {
      const tag = await prisma.tag.findUnique({
        where: { id: tagId },
      });

      if (!tag) {
        return res.status(400).json({ message: "Tag not found" });
      }
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
    if (tagId !== undefined) updateData.tagId = tagId;
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
      return res.status(403).json({ message: "Unauthorized: You can only delete your own posts" });
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
