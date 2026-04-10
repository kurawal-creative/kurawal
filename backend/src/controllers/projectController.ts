import { Request, Response } from "express";
import {prisma} from "../lib/prisma.js";

export const getProjects = async (req: Request, res: Response) => {
	try {
		const projects = await prisma.project.findMany({
			orderBy: { createdAt: "desc" },
		});
		res.json(projects);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getProjectById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (typeof id !== "string") return res.status(400).json({ message: "Invalid ID" });
		const project = await prisma.project.findUnique({
			where: { id },
		});
		if (!project) return res.status(404).json({ message: "Project not found" });
		res.json(project);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const createProject = async (req: Request, res: Response) => {
	try {
		const { name, description, link_github, link_demo, status, env } = req.body;
		const project = await prisma.project.create({
			data: { name, description, link_github, link_demo, status, env },
		});
		res.status(201).json(project);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const updateProject = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (typeof id !== "string") return res.status(400).json({ message: "Invalid ID" });
		const { name, description, link_github, link_demo, status, env } = req.body;
		const project = await prisma.project.update({
			where: { id },
			data: { name, description, link_github, link_demo, status, env },
		});
		res.json(project);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteProject = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (typeof id !== "string") return res.status(400).json({ message: "Invalid ID" });
		await prisma.project.delete({
			where: { id },
		});
		res.json({ message: "Project deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};
