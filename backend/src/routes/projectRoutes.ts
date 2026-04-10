import { Router } from "express";
import {
	getProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
} from "../controllers/projectController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Protected routes (Admin only)
router.post("/", authenticate, createProject);
router.put("/:id", authenticate, updateProject);
router.delete("/:id", authenticate, deleteProject);

export default router;
