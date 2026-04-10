import { Router } from "express";
import { getPosts, getPost, createPost, updatePost, deletePost } from "../controllers/postController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router: Router = Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts (Public)
 *     description: Retrieve a list of all posts with pagination and filtering
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page (max 50)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or description
 *       - in: query
 *         name: tagId
 *         schema:
 *           type: string
 *         description: Filter by tag ID
 *       - in: query
 *         name: tagName
 *         schema:
 *           type: string
 *         description: Filter by tag name (slug)
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 */
router.get("/", getPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get specific post by ID (Public)
 *     description: Retrieve a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *       404:
 *         description: Post not found
 */
router.get("/:id", getPost);

// Admin routes (require authentication)
router.post("/", authenticate, createPost);
router.patch("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);

export default router;
