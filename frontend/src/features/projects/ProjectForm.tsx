import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "@/utils/api";
import { uploadToCloudinary } from "@/utils/cloudinary";

export default function ProjectForm() {
	const { id } = useParams();
	const isEdit = !!id;
	const navigate = useNavigate();
	const [loading, setLoading] = useState(isEdit);
	const [uploading, setUploading] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		images: [] as string[],
		stack: [] as string[],
		startDate: "",
		endDate: "",
		link_github: "",
		link_demo: "",
		status: "Preview",
		env: "",
	});

	useEffect(() => {
		if (isEdit) {
			const fetchProject = async () => {
				try {
					const response = await api.get(`/projects/${id}`);
					const { name, description, images, stack, startDate, endDate, link_github, link_demo, status, env } = response.data;
					setFormData({
						name: name || "",
						description: description || "",
						images: images || [],
						stack: stack || [],
						startDate: startDate ? new Date(startDate).toISOString().split("T")[0] : "",
						endDate: endDate ? new Date(endDate).toISOString().split("T")[0] : "",
						link_github: link_github || "",
						link_demo: link_demo || "",
						status: status || "Preview",
						env: env || "",
					});
				} catch (error) {
					console.error("Failed to fetch project", error);
					alert("Project not found");
					navigate("/admin/project");
				} finally {
					setLoading(false);
				}
			};
			fetchProject();
		}
	}, [id, isEdit, navigate]);

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setUploading(true);
		try {
			const uploadPromises = Array.from(files).map((file) => uploadToCloudinary(file));
			const results = await Promise.all(uploadPromises);
			const newUrls = results.map((res) => res.secure_url);
			setFormData((prev) => ({
				...prev,
				images: [...prev.images, ...newUrls],
			}));
		} catch (error) {
			alert("Gagal upload gambar");
		} finally {
			setUploading(false);
		}
	};

	const removeImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (isEdit) {
				await api.put(`/projects/${id}`, formData);
			} else {
				await api.post("/projects", formData);
			}
			navigate("/admin/project");
		} catch (error) {
			console.error("Failed to save project", error);
			alert("Error saving project");
		}
	};

	if (loading) return <div className="p-4">LOADING FORM...</div>;

	return (
		<div className="p-4 tracking-tighter uppercase">
			<div className="mb-6 flex items-center justify-between border-b border-black pb-2">
				<h1 className="text-xl font-bold">Project / {isEdit ? `Edit / ${id}` : "Create New"}</h1>
				<Link to="/admin/project" className="border border-black px-4 py-1 hover:bg-gray-100">
					Cancel and Return
				</Link>
			</div>

			<form onSubmit={handleSave} className="space-y-6 border border-black p-4">
				<div className="space-y-4">
					<div className="flex flex-col gap-2">
						<label className="text-sm font-bold opacity-50">Project Name</label>
						<input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Project Name..." className="border-b border-black p-2 uppercase focus:bg-gray-50 focus:outline-none" required />
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-bold opacity-50">Stack (Comma separated)</label>
						<input
							type="text"
							name="stack"
							value={formData.stack.join(", ")}
							onChange={(e) => {
								const val = e.target.value;
								setFormData((prev) => ({
									...prev,
									stack: val.split(",").map((s) => s.trim()),
								}));
							}}
							placeholder="React, TypeScript, Node.js..."
							className="border-b border-black p-2 uppercase focus:bg-gray-50 focus:outline-none"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-bold opacity-50">Start Date</label>
							<input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="border-b border-black p-2 uppercase focus:bg-gray-50 focus:outline-none" />
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-bold opacity-50">End Date</label>
							<input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="border-b border-black p-2 uppercase focus:bg-gray-50 focus:outline-none" />
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-bold opacity-50">Project Images</label>
						<div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
							{formData.images.map((url, idx) => (
								<div key={idx} className="relative aspect-square border border-black">
									<img src={url} alt={`Preview ${idx}`} className="h-full w-full object-cover" />
									<button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white hover:bg-red-700">
										✕
									</button>
								</div>
							))}
							<label className="flex aspect-square cursor-pointer items-center justify-center border border-dashed border-black text-4xl text-black hover:bg-gray-50">
								+
								<input type="file" accept="image/*" multiple onChange={handleImageChange} disabled={uploading} className="hidden" />
							</label>
						</div>
						{uploading && <span className="animate-pulse text-[10px] text-black">Uploading...</span>}
					</div>

					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<label className="text-sm font-bold opacity-50">Description (Markdown)</label>
							<div className="flex items-center gap-2">
								<input
									type="file"
									id="desc-image-upload"
									className="hidden"
									accept="image/*"
									multiple
									onChange={async (e) => {
										const files = e.target.files;
										if (!files || files.length === 0) return;
										setUploading(true);
										try {
											const uploadPromises = Array.from(files).map((file) => uploadToCloudinary(file));
											const results = await Promise.all(uploadPromises);
											const markdownImages = results.map((res) => `\n![image](${res.secure_url})\n`).join("");
											setFormData((prev) => ({ ...prev, description: prev.description + markdownImages }));
										} catch (error) {
											alert("Gagal upload gambar deskripsi");
										} finally {
											setUploading(false);
										}
									}}
								/>
								<label htmlFor="desc-image-upload" className="cursor-pointer border border-black px-2 py-1 text-[10px] font-bold uppercase transition-colors hover:bg-black hover:text-white">
									Insert Image
								</label>
							</div>
						</div>
						<textarea name="description" value={formData.description} onChange={handleChange} placeholder="Project Description..." className="h-64 border border-black p-2 text-sm normal-case focus:bg-gray-50 focus:outline-none" />
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-bold opacity-50">Environment Variables (ENV)</label>
						<textarea
							name="env"
							value={formData.env}
							onChange={handleChange}
							placeholder="KEY=VALUE&#10;PORT=3000..."
							className="h-32 border border-black p-2 font-mono text-sm normal-case focus:bg-gray-50 focus:outline-none"
						/>
					</div>

					<div className="grid grid-cols-1 gap-4 border-t border-black pt-4 md:grid-cols-2">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-bold opacity-50">GitHub URL</label>
							<input type="text" name="link_github" value={formData.link_github} onChange={handleChange} placeholder="https://github.com/..." className="border-b border-black p-2 text-sm normal-case focus:bg-gray-50 focus:outline-none" />
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-bold opacity-50">Demo URL</label>
							<input type="text" name="link_demo" value={formData.link_demo} onChange={handleChange} placeholder="https://..." className="border-b border-black p-2 text-sm normal-case focus:bg-gray-50 focus:outline-none" />
						</div>
					</div>

					<div className="flex w-full flex-col gap-2 md:w-1/3">
						<label className="text-sm font-bold opacity-50">Status</label>
						<select name="status" value={formData.status} onChange={handleChange} className="cursor-pointer border border-black p-2 text-sm uppercase focus:bg-gray-50 focus:outline-none">
							<option value="Production">Production</option>
							<option value="Preview">Preview</option>
							<option value="Archived">Archived</option>
						</select>
					</div>
				</div>

				<div className="mt-8 flex gap-4 border-t border-black pt-6">
					<button type="submit" className="border border-black bg-black px-10 py-3 font-bold text-white hover:bg-gray-800">
						{isEdit ? "Update Project" : "Create Project"}
					</button>
					<button type="button" onClick={() => navigate("/admin/project")} className="border border-black px-10 py-3 font-bold hover:bg-gray-100">
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
