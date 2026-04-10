import { Router } from "express";
import { getEnvs, getEnv, createEnv, updateEnv, deleteEnv } from "../controllers/envController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.get("/", authenticate, getEnvs);
router.post("/", authenticate, createEnv);
router.get("/:id", authenticate, getEnv);
router.put("/:id", authenticate, updateEnv);
router.delete("/:id", authenticate, deleteEnv);

export default router;
