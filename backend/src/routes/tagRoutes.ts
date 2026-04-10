import { Router } from 'express';
import { getTags, getTag, createTag, updateTag, deleteTag } from '../controllers/tagController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router: Router = Router();

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags
 *     description: Retrieve a list of all available tags
 *     tags:
 *       - Tags
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Tags retrieved successfully
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new tag
 *     description: Create a new tag
 *     tags:
 *       - Tags
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Web Development
 *               slug:
 *                 type: string
 *                 example: web-development
 *                 description: Optional; auto-generated if omitted
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */

router.get('/', authenticate, getTags);
router.post('/', authenticate, createTag);

/**
 * @swagger
 * /api/tags/{id}:
 *   get:
 *     summary: Get a specific tag
 *     description: Retrieve a tag by ID
 *     tags:
 *       - Tags
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag retrieved successfully
 *       404:
 *         description: Tag not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update a tag
 *     description: Update an existing tag
 *     tags:
 *       - Tags
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Web Development
 *               slug:
 *                 type: string
 *                 example: web-development
 *                 description: Optional; auto-generated if omitted
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       404:
 *         description: Tag not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete a tag
 *     description: Delete a tag by ID
 *     tags:
 *       - Tags
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 *       401:
 *         description: Unauthorized
 */

router.get('/:id', authenticate, getTag);
router.put('/:id', authenticate, updateTag);
router.delete('/:id', authenticate, deleteTag);

export default router;
