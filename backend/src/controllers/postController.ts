import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Post, { IPost } from "../models/Post";
import Tags from "../models/Tags";
import mongoose from "mongoose";

export const getPosts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // --- Ambil & validasi query params ---
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit as string) || 10)
    ); // max 50 per page
    const skip = (page - 1) * limit;

    const search = (req.query.search as string) || "";
    const tag = (req.query.tag as string) || "";

    // --- Buat filter query ---
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { caption: { $regex: search, $options: "i" } },
      ];
    }

    if (tag) {
      filter.tags = tag; // asumsi tags di Post disimpan sebagai string atau ObjectId
      // kalau tags array string: filter.tags = tag;
      // kalau array ObjectId: filter.tags = new mongoose.Types.ObjectId(tag);
    }

    // --- Query utama dengan populate & pagination ---
    const posts = await Post.find(filter)
      .populate("tags", "tag_name") // kalau tags refer ke collection Tags
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // lebih cepat

    // --- Hitung total untuk info pagination ---
    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    // --- Response lengkap ---
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
        tag: tag || null,
      },
    });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data posts",
      error: error.message,
    });
  }
};

export const getPost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
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
    const {
      title,
      description,
      type_post,
      content,
      link_github,
      tech_stack,
      tags: inputTags,
    } = req.body;

    // Validasi: Semua field wajib, tags minimal 1
    if (
      !title ||
      !content ||
      !description ||
      !type_post ||
      !link_github ||
      !tech_stack ||
      !inputTags ||
      !Array.isArray(inputTags) ||
      inputTags.length === 0
    ) {
      return res
        .status(400)
        .json({
          message:
            "All fields are required, including at least one tag in array format",
        });
    }

    // Proses tags: Buat atau find existing, kumpulin ObjectId-nya langsung (nggak string)
    const tagIds: mongoose.Types.ObjectId[] = []; // Array ObjectId, biar type-safe
    for (const tagName of inputTags) {
      if (typeof tagName !== "string" || tagName.trim() === "") {
        return res
          .status(400)
          .json({
            message: `Invalid tag: ${tagName}. Must be non-empty string.`,
          });
      }

      const tagSlug = tagName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""); // Clean slug

      // Cek apakah tag udah ada (unique by slug)
      let existingTag = await Tags.findOne({ tag_slug: tagSlug });
      if (!existingTag) {
        // Buat baru kalau belum ada
        const newTag = new Tags({
          tag_name: tagName.trim(),
          tag_slug: tagSlug,
        });
        existingTag = await newTag.save();
      }

      // Push ObjectId langsung (type-safe, nggak unknown)
      if (existingTag && existingTag._id) {
        tagIds.push(existingTag._id as mongoose.Types.ObjectId); // Cast biar TS senang
      }
    }

    // Buat post dengan array ObjectId tags
    const post = new Post({
      title,
      description,
      type_post,
      content,
      link_github,
      tech_stack,
      authorId: req.user!.id,
      tags: tagIds, // Langsung array ObjectId, nggak perlu map lagi
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type_post,
      content,
      link_github,
      tech_stack,
      tags: inputTags,
    } = req.body;

    // Cari post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Auth check: Pastiin user boleh edit (author)
    if (post.authorId.toString() !== req.user!.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only edit your own posts" });
    }

    // Update fields biasa (partial update)
    if (title) post.title = title;
    if (description) post.description = description;
    if (type_post) post.type_post = type_post;
    if (link_github) post.link_github = link_github;
    if (tech_stack) post.tech_stack = tech_stack;
    if (content) post.content = content;

    // Handle tags update (kalau ada di body)
    if (inputTags !== undefined) {
      // Allow explicit null/empty untuk reset tags
      if (!Array.isArray(inputTags)) {
        return res
          .status(400)
          .json({ message: "Tags must be an array of strings" });
      }

      if (inputTags.length === 0) {
        // Kalau empty array, hapus semua tags
        post.tags = [];
      } else {
        // Proses tags baru: Cek existing atau create, kumpul ObjectId
        const tagIds: mongoose.Types.ObjectId[] = [];
        for (const tagName of inputTags) {
          if (typeof tagName !== "string" || tagName.trim() === "") {
            return res
              .status(400)
              .json({
                message: `Invalid tag: ${tagName}. Must be non-empty string.`,
              });
          }

          const tagSlug = tagName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

          // Cek atau create tag
          let existingTag = await Tags.findOne({ tag_slug: tagSlug });
          if (!existingTag) {
            const newTag = new Tags({
              tag_name: tagName.trim(),
              tag_slug: tagSlug,
            });
            existingTag = await newTag.save();
          }

          if (existingTag && existingTag._id) {
            tagIds.push(existingTag._id as mongoose.Types.ObjectId);
          }
        }

        // Replace tags array
        post.tags = tagIds;
      }
    }

    // Save dan return
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    console.log("Deleted post:", post ? "YES" : "NO");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
};
