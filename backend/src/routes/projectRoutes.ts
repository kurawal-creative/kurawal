import { Router } from "express";
import {
	getProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
} from "../controllers/projectController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router: Router = Router();

// Apply authentication to all project routes
router.use(authenticate);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
