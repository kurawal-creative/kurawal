import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import Env, { IEnv } from '../models/Env.js';
import validator from 'validator';

export const getEnvs = async (req: AuthRequest, res: Response) => {
    try {
        // Ambil query params untuk pagination
        const page = Math.max(1, parseInt(req.query.page as string) || 1); // Default page 1, minimal 1
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10)); // Default 10, max 100

        // Hitung skip
        const skip = (page - 1) * limit;

        // Query: Find dengan pagination + sort default (terbaru dulu)
        // Hapus .lean() buat fix type error
        const envs: IEnv[] = await Env.find({})
            .sort({ createdAt: -1 }) // Best practice: Sort konsisten
            .skip(skip)
            .limit(limit);

        // Hitung total items (efisien, tanpa load semua data)
        const totalItems = await Env.countDocuments({});

        // Hitung pagination metadata
        const totalPages = Math.ceil(totalItems / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            message: 'Envs fetched successfully',
            data: envs,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                limit,
                hasNextPage,
                hasPrevPage,
            },
        });
    } catch (errror) {
        console.error('Error fetching envs:', errror);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getEnv = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Validasi: ID wajib
        if (!id) {
            return res.status(400).json({
                message: 'Env ID is required',
            });
        }

        const env: IEnv | null = await Env.findById(id);
        if (!env) {
            return res.status(404).json({
                message: 'Env not found',
            });
        }

        res.status(200).json({
            message: 'Env fetched successfully',
            data: env,
        });
    } catch (error) {
        console.error('Error fetching env:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createEnv = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, link_github, env: envArray } = req.body;

        // Validasi: Semua field wajib
        if (!title || !description || !link_github || !envArray || !Array.isArray(envArray) || envArray.length === 0) {
            return res.status(400).json({
                message: 'All fields are required, including at least one env variable in array format',
            });
        }

        // Validasi length: title max 100, description max 500
        if (title.trim().length > 100) {
            return res.status(400).json({
                message: 'Title must be at most 100 characters',
            });
        }
        if (description.trim().length > 500) {
            return res.status(400).json({
                message: 'Description must be at most 500 characters',
            });
        }

        // Validasi URL untuk link_github
        if (!validator.isURL(link_github.trim(), { require_protocol: true })) {
            return res.status(400).json({
                message: 'link_github must be a valid URL',
            });
        }

        // Validasi struktur env array: Tiap item harus punya key & value
        for (const item of envArray) {
            if (!item.key || typeof item.key !== 'string' || !item.value || typeof item.value !== 'string' || !item.env_description || typeof item.env_description !== 'string') {
                return res.status(400).json({
                    message: "Each env item must have 'key' (string), 'value' (string), and 'env_description' (string)",
                });
            }

            // Validasi length key max 50
            if (item.key.trim().length > 50) {
                return res.status(400).json({
                    message: 'Each env key must be at most 50 characters',
                });
            }
        }

        // Cek duplikat key di env array
        const keys = envArray.map((item: any) => item.key);
        const uniqueKeys = new Set(keys);
        if (uniqueKeys.size !== keys.length) {
            return res.status(400).json({
                message: 'Env keys must be unique within the array',
            });
        }

        // Cek duplikat title (sebelum save)
        const existingEnv = await Env.findOne({ title: title.trim() });
        if (existingEnv) {
            return res.status(409).json({
                message: `Environment with title '${title}' already exists`,
            });
        }

        const environment = new Env({
            title: title.trim(),
            description: description.trim(),
            link_github: link_github.trim(),
            env: envArray.map((item: any) => ({
                key: item.key.trim(),
                value: item.value.trim(),
                env_description: item.env_description.trim(),
                optional: item.optional ?? false, // Default false
                sensitive: item.sensitive ?? false, // Default false
            })),
        });

        const savedEnv: IEnv = await environment.save();
        res.status(201).json(savedEnv);
    } catch (error) {
        console.error('Error creating env:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateEnv = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, link_github, env: envArray } = req.body;

        // Validasi: ID wajib
        if (!id) {
            return res.status(400).json({
                message: 'Env ID is required',
            });
        }

        // Validasi: Minimal satu field untuk update
        if (!title && !description && !link_github && (!envArray || envArray.length === 0)) {
            return res.status(400).json({
                message: 'At least one field must be provided for update',
            });
        }

        // Cek existence
        const existingEnv: IEnv | null = await Env.findById(id);
        if (!existingEnv) {
            return res.status(404).json({
                message: 'Env not found',
            });
        }

        // Kalau ada title, validasi length dan duplikat
        if (title !== undefined) {
            if (title.trim().length > 100) {
                return res.status(400).json({
                    message: 'Title must be at most 100 characters',
                });
            }
            if (title.trim() !== existingEnv.title) {
                const duplicate = await Env.findOne({ title: title.trim() });
                if (duplicate) {
                    return res.status(409).json({
                        message: `Environment with title '${title}' already exists`,
                    });
                }
            }
        }

        // Kalau ada description, validasi length
        if (description !== undefined) {
            if (description.trim().length > 500) {
                return res.status(400).json({
                    message: 'Description must be at most 500 characters',
                });
            }
        }

        // Kalau ada link_github, validasi URL
        if (link_github !== undefined) {
            if (!validator.isURL(link_github.trim(), { require_protocol: true })) {
                return res.status(400).json({
                    message: 'link_github must be a valid URL',
                });
            }
        }

        // Kalau ada envArray, validasi struktur dan duplikat
        if (envArray !== undefined) {
            if (!Array.isArray(envArray) || envArray.length === 0) {
                return res.status(400).json({
                    message: 'Env array must be non-empty if provided',
                });
            }

            for (const item of envArray) {
                if (!item.key || typeof item.key !== 'string' || !item.value || typeof item.value !== 'string' || !item.env_description || typeof item.env_description !== 'string') {
                    return res.status(400).json({
                        message: "Each env item must have 'key' (string), 'value' (string), and 'env_description' (string)",
                    });
                }

                if (item.key.trim().length > 50) {
                    return res.status(400).json({
                        message: 'Each env key must be at most 50 characters',
                    });
                }
            }

            const keys = envArray.map((item: any) => item.key);
            const uniqueKeys = new Set(keys);
            if (uniqueKeys.size !== keys.length) {
                return res.status(400).json({
                    message: 'Env keys must be unique within the array',
                });
            }
        }

        // Update fields yang ada
        const updateData: any = {};
        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (link_github !== undefined) updateData.link_github = link_github.trim();
        if (envArray !== undefined) {
            updateData.env = envArray.map((item: any) => ({
                key: item.key.trim(),
                value: item.value.trim(),
                env_description: item.env_description.trim(),
                optional: item.optional ?? false,
                sensitive: item.sensitive ?? false,
            }));
        }

        const updatedEnv: IEnv = (await Env.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })) as IEnv;

        res.status(200).json({
            message: 'Env updated successfully',
            data: updatedEnv,
        });
    } catch (error) {
        console.error('Error updating env:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteEnv = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Validasi: ID wajib
        if (!id) {
            return res.status(400).json({
                message: 'Env ID is required',
            });
        }

        const deletedEnv: IEnv | null = await Env.findByIdAndDelete(id);
        if (!deletedEnv) {
            return res.status(404).json({
                message: 'Env not found',
            });
        }

        res.status(200).json({
            message: 'Env deleted successfully',
            data: { id: deletedEnv._id, title: deletedEnv.title },
        });
    } catch (error) {
        console.error('Error deleting env:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
