import { Router } from "express";
import { getWorks, getWorkById, createWork, updateWork, deleteWork } from "../controllers/workController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router: Router = Router();

/**
 * @swagger
 * /api/works:
 *   get:
 *     summary: Get all works (Public)
 *     description: Retrieve a paginated list of works. Sensitive environment variables are excluded.
 *     tags:
 *       - Works
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
 *         description: Number of works per page (max 50)
 *     responses:
 *       200:
 *         description: A paginated list of works
 */
router.get("/", getWorks);

/**
 * @swagger
 * /api/works/{id}:
 *   get:
 *     summary: Get work by ID (Public)
 *     description: Retrieve a specific work by its ID. Sensitive environment variables are excluded.
 *     tags:
 *       - Works
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The work ID
 *     responses:
 *       200:
 *         description: Detailed information about the work
 *       404:
 *         description: Work not found
 */
router.get("/:id", getWorkById);

// Admin routes (require authentication)
router.post("/", authenticate, createWork);
router.put("/:id", authenticate, updateWork);
router.delete("/:id", authenticate, deleteWork);

export default router;
