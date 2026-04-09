import api from "@/utils/api";
import axios from "axios";

export interface Media1 {
	media: Media[];
	pagination: Pagination;
}

export interface Media {
	_id: string;
	publicId: string;
	status: string;
	filename: string;
	createdAt: string;
	__v: number;
}

export interface Pagination {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export async function uploadMedia(file: File, onProgress: (file: File, progress: number) => void) {
	try {
		const baseName = file.name.replace(/\.[^/.]+$/, "");
		const safeBase = baseName
			.toLocaleLowerCase()
			.replace(/[^a-z0-9-_]+/g, "-")
			.replace(/^-+|-+$/g, "");

		const unique = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);

		const extension = file.name.split(".").pop() || "";
		const public_id = `${safeBase}-${unique}`;
		const result = await api.post("/media/signature", {
			public_id: public_id,
			folder: "media",
			status: "uploaded",
		});

		const form = new FormData();

		form.append("file", file);
		form.append("timestamp", result.data.timestamp);
		form.append("signature", result.data.signature);
		form.append("api_key", result.data.api_key);
		form.append("folder", result.data.folder);
		form.append("public_id", result.data.public_id);

		await axios.post(`https://api.cloudinary.com/v1_1/${result.data.cloud_name}/auto/upload`, form, {
			onUploadProgress(progressEvent) {
				if (progressEvent.total) {
					const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					onProgress(file, percentCompleted);
				}
			},
		});

		return true;
	} catch (error) {
		return false;
	}
}

export async function getListMedia(page: number = 1, limit: number = 10) {
	const response = await api.get<Media1>(`/media/listmedia/?page=${page}&limit=${limit}`);
	return response.data;
}

export function pathToUrl(path: string) {
	return `${import.meta.env.VITE_URL_CLOUDINARY}/${path}`;
}

export async function deleteMedia(public_id: string) {
	const res = await api.delete(`/media/delete/?public_id=${public_id}`);
	return res.data;
}
