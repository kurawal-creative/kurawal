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
		image: "",
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
					const { name, description, image, link_github, link_demo, status, env } = response.data;
					setFormData({
						name: name || "",
						description: description || "",
						image: image || "",
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
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		try {
			const result = await uploadToCloudinary(file);
			setFormData((prev) => ({ ...prev, image: result.secure_url }));
		} catch (error) {
			alert("Gagal upload gambar");
		} finally {
			setUploading(false);
		}
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
						<label className="text-sm font-bold opacity-50">Project Image</label>
						<div className="flex items-center gap-4">
							{formData.image && <img src={formData.image} alt="Preview" className="h-24 w-24 border border-black object-cover" />}
							<div className="flex flex-col gap-2">
								<input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} className="text-xs uppercase" />
								{uploading && <span className="animate-pulse text-[10px]">Uploading...</span>}
								<input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Atau masukkan URL gambar..." className="w-full border-b border-black p-1 text-xs normal-case focus:outline-none" />
							</div>
						</div>
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
									onChange={async (e) => {
										const file = e.target.files?.[0];
										if (!file) return;
										setUploading(true);
										try {
											const result = await uploadToCloudinary(file);
											const markdownImage = `\n![image](${result.secure_url})\n`;
											setFormData((prev) => ({ ...prev, description: prev.description + markdownImage }));
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
						<textarea name="description" value={formData.description} onChange={handleChange} placeholder="Project Description..." className="h-64 border border-black p-2 text-sm normal-case focus:bg-gray-50 focus:outline-none" required />
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
