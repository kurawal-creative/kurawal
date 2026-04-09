import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { prisma } from '../lib/prisma.js';
import { extractPublicIdFromUrl, deleteFullMedia, extractCloudinaryUrlsFromContent, linkMediaToPost, linkMultipleMediaToPost } from '../utils/mediaHelpers.js';

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
        const skip = (page - 1) * limit;

        const search = (req.query.search as string) || '';
        const tagId = (req.query.tagId as string) || '';

        const where: any = {};

        if (search) {
            where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
        }

        if (tagId) {
            where.tagId = tagId;
        }

        const [posts, totalPosts] = await Promise.all([
            prisma.post.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.post.count({ where }),
        ]);

        const totalPages = Math.ceil(totalPosts / limit);

        res.json({
            success: true,
            data: posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalPosts,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            filters: {
                search: search || null,
                tagId: tagId || null,
            },
        });
    } catch (error: any) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch posts',
            error: error.message,
        });
    }
};

export const getPost = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;

        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, type_post, content, link_github, thumbnail, tagId, status } = req.body;

        if (!title || !content || !tagId) {
            return res.status(400).json({ message: 'title, content, and tagId are required' });
        }

        if (type_post && !['POST', 'PROJECT'].includes(type_post)) {
            return res.status(400).json({ message: 'type_post must be POST or PROJECT' });
        }

        if (status && !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
            return res.status(400).json({ message: 'status must be DRAFT, PUBLISHED, or ARCHIVED' });
        }

        const existingTag = await prisma.tag.findUnique({
            where: { id: tagId },
        });

        if (!existingTag) {
            return res.status(400).json({ message: 'Tag not found' });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                tagId,
                userId: req.user!.id,
                description: description ?? null,
                link_github: link_github ?? null,
                thumbnail: thumbnail ?? null,
                type_post: type_post ?? 'POST',
                status: status ?? 'DRAFT',
            },
        });

        // Collect all media public IDs from thumbnail and content
        const publicIds = new Set<string>();

        if (thumbnail) {
            const publicId = extractPublicIdFromUrl(thumbnail);
            if (publicId) {
                publicIds.add(publicId);
            }
        }

        const contentUrls = extractCloudinaryUrlsFromContent(content);
        for (const url of contentUrls) {
            const publicId = extractPublicIdFromUrl(url);
            if (publicId) {
                publicIds.add(publicId);
            }
        }

        // Link media to post
        if (publicIds.size > 0) {
            const linkedCount = await linkMultipleMediaToPost(Array.from(publicIds), post.id);
            console.log(`Linked ${linkedCount} media to post ${post.id}`);
        }

        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const { title, description, type_post, content, link_github, thumbnail, tagId, status } = req.body;

        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.userId !== req.user!.id) {
            return res.status(403).json({ message: 'Unauthorized: You can only edit your own posts' });
        }

        if (type_post !== undefined && !['POST', 'PROJECT'].includes(type_post)) {
            return res.status(400).json({ message: 'type_post must be POST or PROJECT' });
        }

        if (status !== undefined && !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
            return res.status(400).json({ message: 'status must be DRAFT, PUBLISHED, or ARCHIVED' });
        }

        if (tagId !== undefined) {
            const tag = await prisma.tag.findUnique({
                where: { id: tagId },
            });

            if (!tag) {
                return res.status(400).json({ message: 'Tag not found' });
            }
        }

        if (thumbnail !== undefined && thumbnail !== post.thumbnail) {
            if (post.thumbnail) {
                const oldPublicId = extractPublicIdFromUrl(post.thumbnail);
                if (oldPublicId) {
                    await deleteFullMedia(oldPublicId);
                }
            }

            if (thumbnail) {
                const newPublicId = extractPublicIdFromUrl(thumbnail);
                if (newPublicId) {
                    // Link media to post
                    await linkMediaToPost(newPublicId, post.id);
                }
            }
        }

        if (content !== undefined && content !== post.content) {
            const oldUrls = extractCloudinaryUrlsFromContent(post.content);
            const newUrls = extractCloudinaryUrlsFromContent(content);

            const removedUrls = oldUrls.filter((url) => !newUrls.includes(url));
            for (const url of removedUrls) {
                const publicId = extractPublicIdFromUrl(url);
                if (publicId) {
                    await deleteFullMedia(publicId);
                }
            }

            const addedUrls = newUrls.filter((url) => !oldUrls.includes(url));
            const addedPublicIds = addedUrls.map((url) => extractPublicIdFromUrl(url)).filter((publicId): publicId is string => Boolean(publicId));

            if (addedPublicIds.length > 0) {
                // Link media to post
                const linkedCount = await linkMultipleMediaToPost(addedPublicIds, post.id);
                console.log(`Linked ${linkedCount} additional media to post ${post.id}`);
            }
        }

        const updateData: any = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (type_post !== undefined) updateData.type_post = type_post;
        if (content !== undefined) updateData.content = content;
        if (link_github !== undefined) updateData.link_github = link_github;
        if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
        if (tagId !== undefined) updateData.tagId = tagId;
        if (status !== undefined) updateData.status = status;

        const updatedPost = await prisma.post.update({
            where: { id },
            data: updateData,
        });

        res.json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;

        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.userId !== req.user!.id) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own posts' });
        }

        if (post.thumbnail) {
            const publicId = extractPublicIdFromUrl(post.thumbnail);
            if (publicId) {
                await deleteFullMedia(publicId);
            }
        }

        const contentUrls = extractCloudinaryUrlsFromContent(post.content);
        for (const url of contentUrls) {
            const publicId = extractPublicIdFromUrl(url);
            if (publicId) {
                await deleteFullMedia(publicId);
            }
        }

        await prisma.post.delete({
            where: { id },
        });

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
