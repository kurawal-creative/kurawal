import cloudinary from './cloudinary.js';
import { prisma } from '../lib/prisma.js';

/**
 * Extract public ID from Cloudinary URL
 * Converts: https://res.cloudinary.com/cloud/image/upload/folder/publicId
 * To: folder/publicId
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
    try {
        const regex = /\/upload\/(.+?)(?:\?|$)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch (error) {
        console.error('Error extracting publicId from URL:', error);
        return null;
    }
};

/**
 * Extract all Cloudinary URLs from content
 */
export const extractCloudinaryUrlsFromContent = (content: string): string[] => {
    try {
        const regex = /https:\/\/res\.cloudinary\.com\/[^/]+\/[^/]+\/upload\/[^\s"'<>)]+/g;
        return content.match(regex) || [];
    } catch (error) {
        console.error('Error extracting Cloudinary URLs from content:', error);
        return [];
    }
};

/**
 * Delete media from Cloudinary
 */
export const deleteMediaFromCloudinary = async (publicId: string): Promise<boolean> => {
    try {
        // Remove file extension if present
        const publicIdClean = publicId.replace(/\.(png|jpe?g|gif|webp|mp4|pdf|svg|bmp|ico|mov|avi|wmv|doc|docx|txt|zip|json|xml|csv)$/i, '');

        console.log('Deleting from Cloudinary:', publicIdClean);

        const result = await cloudinary.uploader.destroy(publicIdClean, {
            invalidate: true,
        });

        if (result.result !== 'ok' && result.result !== 'not found') {
            console.warn('Cloudinary delete warning:', result);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return false;
    }
};

/**
 * Delete media record from database
 */
export const deleteMediaRecord = async (publicId: string): Promise<boolean> => {
    try {
        const media = await prisma.media.findUnique({
            where: { publicId },
        });

        if (!media) {
            console.warn('Media record not found for publicId:', publicId);
            return false;
        }

        await prisma.media.delete({
            where: { id: media.id },
        });

        return true;
    } catch (error) {
        console.error('Error deleting media record:', error);
        return false;
    }
};

/**
 * Update media status and link to post
 * Simple: just update status to ACTIVE and set postId
 */
export const updateMediaStatus = async (publicId: string, status: string, postId?: string): Promise<boolean> => {
    try {
        const media = await prisma.media.findUnique({
            where: { publicId },
        });

        if (!media) {
            console.warn('Media record not found for publicId:', publicId);
            return false;
        }

        const updateData: any = { status };
        if (postId) updateData.postId = postId;

        await prisma.media.update({
            where: { id: media.id },
            data: updateData,
        });

        return true;
    } catch (error) {
        console.error('Error updating media status:', error);
        return false;
    }
};

/**
 * Fetch media by public ID
 */
export const getMediaByPublicId = async (publicId: string) => {
    try {
        const media = await prisma.media.findUnique({
            where: { publicId },
        });

        return media;
    } catch (error) {
        console.error('Error fetching media by publicId:', error);
        return null;
    }
};

/**
 * Link media to post
 * Simple: just update status to ACTIVE and set postId
 */
export const linkMediaToPost = async (publicId: string, postId: string): Promise<boolean> => {
    try {
        const media = await getMediaByPublicId(publicId);

        if (!media) {
            console.warn('Media not found, cannot link to post:', publicId);
            return false;
        }

        await prisma.media.update({
            where: { id: media.id },
            data: {
                status: 'ACTIVE',
                postId,
            },
        });

        return true;
    } catch (error) {
        console.error('Error linking media to post:', error);
        return false;
    }
};

/**
 * Link multiple media to post
 * Simple: just validate and update status + postId
 */
export const linkMultipleMediaToPost = async (publicIds: string[], postId: string): Promise<number> => {
    try {
        const validPublicIds: string[] = [];

        // Validate all exist
        for (const publicId of publicIds) {
            const media = await getMediaByPublicId(publicId);
            if (media) {
                validPublicIds.push(publicId);
            } else {
                console.warn('Media not found, skipping:', publicId);
            }
        }

        if (validPublicIds.length === 0) {
            console.warn('No valid media found to link to post');
            return 0;
        }

        const result = await prisma.media.updateMany({
            where: { publicId: { in: validPublicIds } },
            data: {
                status: 'ACTIVE',
                postId,
            },
        });

        return result.count;
    } catch (error) {
        console.error('Error linking multiple media to post:', error);
        return 0;
    }
};

/**
 * Delete full media (both from Cloudinary and database)
 */
export const deleteFullMedia = async (publicId: string): Promise<boolean> => {
    try {
        // Delete from Cloudinary first
        await deleteMediaFromCloudinary(publicId);
        // Then delete from database
        await deleteMediaRecord(publicId);
        return true;
    } catch (error) {
        console.error('Error deleting full media:', error);
        return false;
    }
};
