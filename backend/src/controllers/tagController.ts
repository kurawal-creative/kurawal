import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { prisma } from '../lib/prisma.js';

export const getTags = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
        const skip = (page - 1) * limit;
        const search = (req.query.search as string) || '';

        const where: any = search
            ? {
                  name: {
                      contains: search,
                      mode: 'insensitive' as const,
                  },
              }
            : {};

        const [tags, totalItems] = await Promise.all([
            prisma.tag.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.tag.count({ where }),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        res.json({
            success: true,
            data: tags,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error: any) {
        console.error('Error fetching tags:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tags',
            error: error.message,
        });
    }
};

export const getTag = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const tag = await prisma.tag.findUnique({
            where: { id },
        });

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: 'Tag not found',
            });
        }

        res.json({
            success: true,
            data: tag,
        });
    } catch (error: any) {
        console.error('Error fetching tag:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tag',
            error: error.message,
        });
    }
};

export const createTag = async (req: AuthRequest, res: Response) => {
    try {
        const { name, slug } = req.body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Tag name is required and must be a non-empty string',
            });
        }

        const normalizedSlug =
            typeof slug === 'string' && slug.trim() !== ''
                ? slug.trim()
                : name
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '');

        const existingTag = await prisma.tag.findUnique({
            where: { slug: normalizedSlug },
        });

        if (existingTag) {
            return res.status(409).json({
                success: false,
                message: 'Tag with this slug already exists',
            });
        }

        const newTag = await prisma.tag.create({
            data: {
                name: name.trim(),
                slug: normalizedSlug,
            },
        });

        res.status(201).json({
            success: true,
            data: newTag,
        });
    } catch (error: any) {
        console.error('Error creating tag:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create tag',
            error: error.message,
        });
    }
};

export const updateTag = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;

        if ((name === undefined || name === null) && (slug === undefined || slug === null)) {
            return res.status(400).json({
                success: false,
                message: 'At least one field must be provided',
            });
        }

        const existingTag = await prisma.tag.findUnique({
            where: { id },
        });

        if (!existingTag) {
            return res.status(404).json({
                success: false,
                message: 'Tag not found',
            });
        }

        const newName = typeof name === 'string' ? name.trim() : existingTag.name;
        const newSlug =
            typeof slug === 'string' && slug.trim() !== ''
                ? slug.trim()
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
                return res.status(409).json({
                    success: false,
                    message: 'Slug already exists',
                });
            }
        }

        const updatedTag = await prisma.tag.update({
            where: { id },
            data: {
                name: newName,
                slug: newSlug,
            },
        });

        res.json({
            success: true,
            data: updatedTag,
        });
    } catch (error: any) {
        console.error('Error updating tag:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update tag',
            error: error.message,
        });
    }
};

export const deleteTag = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const deletedTag = await prisma.tag.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'Tag deleted successfully',
            data: { id: deletedTag.id, name: deletedTag.name },
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Tag not found',
            });
        }

        console.error('Error deleting tag:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete tag',
            error: error.message,
        });
    }
};
