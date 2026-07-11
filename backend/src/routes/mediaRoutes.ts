import { Router } from "express";
import { listMedia, getSignature, deleteMedia } from "../controllers/mediaController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router: Router = Router();

// All media routes require authentication
router.get("/listmedia", authenticate, listMedia);
router.post("/signature", authenticate, getSignature);
router.delete("/delete", authenticate, deleteMedia);

export default router;
