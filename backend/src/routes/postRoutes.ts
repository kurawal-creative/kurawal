import { Router } from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost } from '../controllers/postController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router: Router = Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve a list of all posts with pagination and filtering
 *     tags:
 *       - Posts
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page (max 50)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or description
 *       - in: query
 *         name: tagId
 *         schema:
 *           type: string
 *         description: Filter by tag ID
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new post
 *     description: |
 *       Create a new post with title, content, and optional metadata.
 *
 *       **Media Handling:**
 *       - Frontend upload ke Cloudinary via `/api/media/signature`
 *       - Frontend dapat full Cloudinary URL dari response upload
 *       - Kirim full URL ke `thumbnail` atau dalam `content`
 *       - Backend akan extract publicId, cari media record, dan ubah status PENDING → ACTIVE
 *     tags:
 *       - Posts
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - tagId
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Awesome Project
 *               description:
 *                 type: string
 *                 example: A brief description of the project
 *               type_post:
 *                 type: string
 *                 example: PROJECT
 *                 description: POST or PROJECT
 *               content:
 *                 type: string
 *                 example: Detailed content in markdown or HTML with ![image](https://res.cloudinary.com/...)
 *                 description: Can contain Cloudinary URLs for embedded images/media
 *               link_github:
 *                 type: string
 *                 example: https://github.com/user/repo
 *               thumbnail:
 *                 type: string
 *                 example: https://res.cloudinary.com/your-cloud/image/upload/posts/abc1def2ghi3jkl4
 *                 description: Cloudinary image URL (must be from signature endpoint)
 *               tagId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               status:
 *                 type: string
 *                 example: PUBLISHED
 *                 description: DRAFT, PUBLISHED, or ARCHIVED
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */

router.get('/', authenticate, getPosts);
router.post('/', authenticate, createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a specific post
 *     description: Retrieve a post by ID
 *     tags:
 *       - Posts
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update a post
 *     description: |
 *       Update an existing post (only by author).
 *
 *       **Media Handling:**
 *       - If `thumbnail` changes, update associated media references
 *       - If content changes, ensure media references stay consistent
 *     tags:
 *       - Posts
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type_post:
 *                 type: string
 *               content:
 *                 type: string
 *               link_github:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 description: Cloudinary image URL (optional, will delete old image if changed)
 *               tagId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       403:
 *         description: Forbidden - Not the author
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete a post
 *     description: |
 *       Delete a post by ID (only by author).
 *
 *       **Media Cleanup:**
 *       - Associated thumbnail will be deleted from both Cloudinary and database
 *       - All Cloudinary URLs in content will be deleted from both Cloudinary and database
 *     tags:
 *       - Posts
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       403:
 *         description: Forbidden - Not the author
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 */

router.get('/:id', authenticate, getPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;
