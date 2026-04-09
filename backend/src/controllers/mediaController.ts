import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import cloudinary from '../utils/cloudinary.js';
import { prisma } from '../lib/prisma.js';

// Generate upload signature for direct Cloudinary upload
export const getUploadSignature = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { folder = 'temp', filename } = req.body;

        if (!filename) {
            res.status(400).json({ error: 'filename is required' });
            return;
        }

        const timestamp = Math.round(Date.now() / 1000);

        // Generate random publicId without original filename
        const publicId = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

        // Parameters must be sorted alphabetically for Cloudinary signature
        const paramsToSign: any = {
            folder,
            public_id: publicId,
            timestamp,
        };

        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string);

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

        // Full publicId with folder
        const fullPublicId = `${folder}/${publicId}`;

        // Create media record with pending status
        const media = await prisma.media.create({
            data: {
                publicId: fullPublicId,
                filename,
                status: 'PENDING',
            } as any,
        });

        res.status(200).json({
            timestamp,
            signature,
            cloud_name: cloudName,
            api_key: process.env.CLOUDINARY_API_KEY,
            folder,
            cloudinary_url: cloudinaryUrl,
            media_id: media.id,
            public_id: publicId, // Send without folder prefix to client
        });
    } catch (error) {
        console.error('Error generating signature:', error);
        res.status(500).json({ error: 'Failed to generate signature' });
    }
};
