import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { prisma } from '../lib/prisma.js';

export const getTags = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';

        const pageNum = page < 1 ? 1 : page;
        const limitNum = limit < 1 ? 10 : limit > 100 ? 100 : limit;
        const skip = (pageNum - 1) * limitNum;

        const where: any = search
            ? {
                  name: {
                      contains: search,
                      mode: 'insensitive' as const,
                  },
              }
            : {};

        const [tags, totalTags] = await Promise.all([
            prisma.tag.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            prisma.tag.count({ where }),
        ]);

        const totalPages = Math.ceil(totalTags / limitNum);

        res.json({
            success: true,
            data: tags,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems: totalTags,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
            },
            search,
        });
    } catch (error: any) {
        console.error('Error fetching tags:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data tags',
            error: error.message,
        });
    }
};

export const getTag = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const tag = await prisma.tag.findUnique({
            where: { id },
        });

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.json(tag);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createTag = async (req: AuthRequest, res: Response) => {
    try {
        const { name, slug } = req.body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: 'Tag name is required and must be a non-empty string' });
        }

        const normalizedSlug =
            typeof slug === 'string' && slug.trim() !== ''
                ? slug
                : name
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '');

        const existingTag = await prisma.tag.findUnique({
            where: { slug: normalizedSlug },
        });

        if (existingTag) {
            return res.status(400).json({ message: 'Tag already exists' });
        }

        const newTag = await prisma.tag.create({
            data: {
                name: name.trim(),
                slug: normalizedSlug,
            },
        });

        res.status(201).json(newTag);
    } catch (error) {
        console.error('Error creating tag:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateTag = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name, slug } = req.body;

        if ((name === undefined || name === null) && (slug === undefined || slug === null)) {
            return res.status(400).json({ message: 'At least one field must be provided' });
        }

        const existingTag = await prisma.tag.findUnique({
            where: { id },
        });

        if (!existingTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        const newName = typeof name === 'string' ? name.trim() : existingTag.name;
        const newSlug =
            typeof slug === 'string' && slug.trim() !== ''
                ? slug
                : typeof name === 'string' && name.trim() !== ''
                  ? name
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')
                  : existingTag.slug;

        if (newSlug !== existingTag.slug) {
            const slugExists = await prisma.tag.findUnique({
                where: { slug: newSlug },
            });

            if (slugExists) {
                return res.status(400).json({ message: 'Slug already exists' });
            }
        }

        const updatedTag = await prisma.tag.update({
            where: { id },
            data: {
                name: newName,
                slug: newSlug,
            },
        });

        res.json(updatedTag);
    } catch (error) {
        console.error('Error updating tag:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteTag = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;

        await prisma.tag.delete({
            where: { id },
        });

        res.json({ message: 'Tag deleted successfully' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Tag not found' });
        }

        console.error('Error deleting tag:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
