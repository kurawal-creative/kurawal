import { Router } from "express";
import { getUploadSignature, getSimpleUploadSignature } from "../controllers/mediaController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router: Router = Router();

/**
 * @swagger
 * /api/media/upload-signature:
 *   get:
 *     summary: Get simple upload signature for tmp folder
 *     tags:
 *       - Media
 *     responses:
 *       200:
 *         description: Signature generated successfully
 */
router.get("/upload-signature", getSimpleUploadSignature);

/**
 * @swagger
 * /api/media/signature:
 *   post:
 *     summary: Get Cloudinary upload signature
 *     description: |
 *       Generate upload signature untuk direct upload ke Cloudinary dari client.
 *       Media record akan dibuat di database dengan status "PENDING".
 *       Public ID di-generate secara random tanpa menggunakan nama file asli.
 *
 *       **Flow Upload:**
 *       1. Client → Server: Minta signature dengan filename (`POST /api/media/signature`)
 *       2. Server: Generate random public_id & signature, create media record (status: PENDING)
 *       3. Client → Cloudinary: Upload file dengan public_id dan signature
 *       4. Media ready di database dengan status PENDING
 *
 *       **Contoh Client (Vanilla JS):**
 *       ```javascript
 *       async function uploadFile(file) {
 *         // Step 1: Get signature from server
 *         const sigRes = await fetch('/api/media/signature', {
 *           method: 'POST',
 *           headers: { 'Content-Type': 'application/json' },
 *           body: JSON.stringify({
 *             filename: file.name,
 *             folder: 'posts'
 *           }),
 *           credentials: 'include'
 *         });
 *         const { timestamp, signature, cloudinary_url, api_key, public_id } = await sigRes.json();
 *
 *         // Step 2: Upload directly to Cloudinary
 *         const formData = new FormData();
 *         formData.append('file', file);
 *         formData.append('api_key', api_key);
 *         formData.append('timestamp', timestamp);
 *         formData.append('signature', signature);
 *         formData.append('public_id', public_id);
 *
 *         const uploadRes = await fetch(cloudinary_url, {
 *           method: 'POST',
 *           body: formData
 *         });
 *
 *         const result = await uploadRes.json();
 *         console.log('Upload success:', result.secure_url);
 *         return result;
 *       }
 *       ```
 *
 *       **Contoh Client (React/Axios):**
 *       ```javascript
 *       const handleUpload = async (file) => {
 *         // Get signature
 *         const { data: sig } = await axios.post('/api/media/signature', {
 *           filename: file.name,
 *           folder: 'posts'
 *         });
 *
 *         // Upload to Cloudinary
 *         const formData = new FormData();
 *         formData.append('file', file);
 *         formData.append('api_key', sig.api_key);
 *         formData.append('timestamp', sig.timestamp);
 *         formData.append('signature', sig.signature);
 *         formData.append('public_id', sig.public_id);
 *
 *         const { data } = await axios.post(sig.cloudinary_url, formData);
 *         console.log('URL:', data.secure_url);
 *         return data;
 *       };
 *       ```
 *     tags:
 *       - Media
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *             properties:
 *               filename:
 *                 type: string
 *                 example: photo.jpg
 *               folder:
 *                 type: string
 *                 example: posts
 *                 default: temp
 *     responses:
 *       200:
 *         description: Signature generated successfully - Media record created with status PENDING in database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timestamp:
 *                   type: number
 *                   example: 1707761234
 *                 signature:
 *                   type: string
 *                   example: abcd1234efgh5678
 *                 cloud_name:
 *                   type: string
 *                   example: your-cloud-name
 *                 api_key:
 *                   type: string
 *                   example: 123456789012345
 *                 folder:
 *                   type: string
 *                   example: posts
 *                 cloudinary_url:
 *                   type: string
 *                   example: https://api.cloudinary.com/v1_1/your-cloud/auto/upload
 *                 media_id:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439011
 *                   description: Database media ID - reference saat create/update post
 *                 public_id:
 *                   type: string
 *                   example: abc1def2ghi3jkl4
 *                   description: Random generated ID untuk upload (tanpa folder prefix)
 *       400:
 *         description: filename or postId is required
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 */

router.post("/signature", authenticate, getUploadSignature);

export default router;
