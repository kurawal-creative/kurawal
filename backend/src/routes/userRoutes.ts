import { Router, type Response } from "express";
import { authenticate, type AuthRequest } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.get("/profile", authenticate, (req: AuthRequest, res: Response) => {
  res.json(req.user);
});

export default router;
