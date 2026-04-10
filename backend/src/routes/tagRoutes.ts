import { Router } from "express";
import { getTags, getTag, createTag, updateTag, deleteTag } from "../controllers/tagController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router: Router = Router();

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags (Public)
 *     description: Retrieve a list of all available tags
 *     tags:
 *       - Tags
 *     responses:
 *       200:
 *         description: Tags retrieved successfully
 */
router.get("/", getTags);

/**
 * @swagger
 * /api/tags/{id}:
 *   get:
 *     summary: Get specific tag by ID (Public)
 *     description: Retrieve a tag by ID
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tag ID
 *     responses:
 *       200:
 *         description: Tag retrieved successfully
 *       404:
 *         description: Tag not found
 */
router.get("/:id", getTag);

// Admin routes (require authentication)
router.post("/", authenticate, createTag);
router.put("/:id", authenticate, updateTag);
router.delete("/:id", authenticate, deleteTag);

export default router;
