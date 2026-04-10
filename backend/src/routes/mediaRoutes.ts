import { Router } from "express";
import { getUploadSignature, getSimpleUploadSignature } from "../controllers/mediaController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.get("/upload-signature", getSimpleUploadSignature);
export default router;
