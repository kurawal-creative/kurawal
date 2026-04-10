import { Router } from "express";
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from "../controllers/projectController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router: Router = Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects (Public)
 *     description: Retrieve a paginated list of projects. Sensitive environment variables are excluded.
 *     tags:
 *       - Projects
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
 *         description: Number of projects per page (max 50)
 *     responses:
 *       200:
 *         description: A paginated list of projects
 */
router.get("/", getProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID (Public)
 *     description: Retrieve a specific project by its ID. Sensitive environment variables are excluded.
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Detailed information about the project
 *       404:
 *         description: Project not found
 */
router.get("/:id", getProjectById);

// Admin routes (require authentication)
router.post("/", authenticate, createProject);
router.put("/:id", authenticate, updateProject);
router.delete("/:id", authenticate, deleteProject);

export default router;
