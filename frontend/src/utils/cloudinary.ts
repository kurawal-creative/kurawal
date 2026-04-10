import axios from "axios";
import api from "./api";

/**
 * Upload image to Cloudinary using signed signature from backend
 */
export const uploadToCloudinary = async (file: File) => {
	try {
		// 1. Get signature from backend
		const { data: sig } = await api.get("/upload-signature");

		// 2. Prepare FormData for Cloudinary
		const cloudFormData = new FormData();
		cloudFormData.append("file", file);
		cloudFormData.append("api_key", sig.apiKey);
		cloudFormData.append("timestamp", sig.timestamp);
		cloudFormData.append("signature", sig.signature);
		cloudFormData.append("folder", sig.folder);

		// 3. Upload directly to Cloudinary
		const res = await axios.post(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, cloudFormData);

		return res.data; // Result contains secure_url and public_id
	} catch (error) {
		console.error("Cloudinary upload error:", error);
		throw error;
	}
};
