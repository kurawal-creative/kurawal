import express, { type Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import { apiReference } from "@scalar/express-api-reference";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import envRoutes from "./routes/envRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app: Express = express();

app.use(compression());

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/envs", envRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/projects", projectRoutes);

app.use("/api-docs", apiReference({ url: "/swagger.json" }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(__dirname, "..", "..", "frontend", "dist");

app.use(express.static(staticDir));

app.use((_req, res, _next) => {
  return res.sendFile(path.join(staticDir, "index.html"));
});

export default app;
