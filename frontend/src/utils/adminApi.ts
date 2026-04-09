import axios from "axios";

const API_BASE_URL = "/api";

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

// Posts API
export const postsApi = {
	getAll: async (page = 1, limit = 10, search = "", tagId = "") => {
		const response = await apiClient.get("/posts", {
			params: { page, limit, search, tagId },
		});
		return response.data;
	},

	getById: async (id: string) => {
		const response = await apiClient.get(`/posts/${id}`);
		return response.data;
	},

	create: async (data: { title: string; description?: string; content: string; type_post?: "POST" | "PROJECT"; link_github?: string; thumbnail?: string; tagId: string; status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" }) => {
		const response = await apiClient.post("/posts", data);
		return response.data;
	},

	update: async (
		id: string,
		data: Partial<{
			title: string;
			description: string;
			content: string;
			type_post: "POST" | "PROJECT";
			link_github: string;
			thumbnail: string;
			tagId: string;
			status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
		}>,
	) => {
		const response = await apiClient.patch(`/posts/${id}`, data);
		return response.data;
	},

	delete: async (id: string) => {
		const response = await apiClient.delete(`/posts/${id}`);
		return response.data;
	},
};

// Tags API
export const tagsApi = {
	getAll: async (page = 1, limit = 10, search = "") => {
		const response = await apiClient.get("/tags", {
			params: { page, limit, search },
		});
		return response.data;
	},

	getById: async (id: string) => {
		const response = await apiClient.get(`/tags/${id}`);
		return response.data;
	},

	create: async (data: { name: string; slug?: string }) => {
		const response = await apiClient.post("/tags", data);
		return response.data;
	},

	update: async (id: string, data: { name?: string; slug?: string }) => {
		const response = await apiClient.patch(`/tags/${id}`, data);
		return response.data;
	},

	delete: async (id: string) => {
		const response = await apiClient.delete(`/tags/${id}`);
		return response.data;
	},
};

// Media API
export const mediaApi = {
	getUploadSignature: async (filename: string, folder = "temp") => {
		const response = await apiClient.post("/media/signature", {
			filename,
			folder,
		});
		return response.data;
	},
};

// User API
export const userApi = {
	getProfile: async () => {
		const response = await apiClient.get("/user/profile");
		return response.data;
	},
};

export default apiClient;
