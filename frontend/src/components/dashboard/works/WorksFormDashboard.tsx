import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X, Upload, Loader2, Plus } from "lucide-react";
import api from "@/utils/api";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
			alert("Failed to upload images");
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

		// Validation
		if (!formData.name.trim()) {
			alert("Project name is required");
			return;
		}

		if (formData.images.length === 0) {
			alert("At least one project image is required");
			return;
		}

		if (!formData.startDate) {
			alert("Start date is required");
			return;
		}

		if (!formData.endDate) {
			alert("End date is required");
			return;
		}

		try {
			if (isEdit) {
				await api.put(`/projects/${id}`, formData);
			} else {
				await api.post("/projects", formData);
			}
			navigate("/dashboard/project");
		} catch (error) {
			console.error("Failed to save project", error);
			alert("Error saving project");
		}
	};

	if (loading) {
		return (
			<div className="space-y-6 p-6">
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-10 w-24" />
				</div>
				<div className="rounded-lg border bg-white shadow-sm">
					<div className="space-y-4 p-6">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-32 w-full" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-semibold">{isEdit ? "Edit Project" : "Create Project"}</h1>
					<p className="text-muted-foreground mt-1 text-sm">{isEdit ? `Update project information and assets for "${formData.name}".` : "Add a new project to the company portfolio."}</p>
				</div>
				<Button asChild variant="outline" size="sm">
					<Link to="/dashboard/works">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Link>
				</Button>
			</div>

			<form onSubmit={handleSave}>
				<Tabs defaultValue="basic" className="space-y-6">
					<TabsList className="bg-gray-100">
						<TabsTrigger value="basic" className="data-[state=active]:bg-white">
							Basic Information
						</TabsTrigger>
						<TabsTrigger value="media" className="data-[state=active]:bg-white">
							Images
						</TabsTrigger>
						<TabsTrigger value="links" className="data-[state=active]:bg-white">
							Timeline & Links
						</TabsTrigger>
						<TabsTrigger value="advanced" className="data-[state=active]:bg-white">
							Advanced
						</TabsTrigger>
					</TabsList>

					<TabsContent value="basic" className="space-y-6">
						<div className="overflow-hidden rounded-lg border bg-white shadow-sm">
							<div className="border-b bg-gray-50 px-6 py-4">
								<h2 className="text-base font-semibold text-gray-700">Project Details</h2>
							</div>
							<div className="space-y-5 p-6">
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700">
										Project Name <span className="text-red-600">*</span>
									</label>
									<input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter project name" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none" required />
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700">
										Description <span className="text-red-600">*</span>
									</label>
									<textarea name="description" value={formData.description} onChange={handleChange} placeholder="Project description (supports markdown)" className="min-h-32 w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none" required />
								</div>

								<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-700">
											Status <span className="text-red-600">*</span>
										</label>
										<select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none" required>
											<option value="Production">Production</option>
											<option value="Preview">Preview</option>
											<option value="Archived">Archived</option>
										</select>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-700">
											Tech Stack <span className="text-red-600">*</span>
										</label>
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
											placeholder="React, TypeScript, Node.js"
											className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none"
											required
										/>
									</div>
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="media" className="space-y-6">
						<div className="overflow-hidden rounded-lg border bg-white shadow-sm">
							<div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
								<div>
									<h2 className="text-base font-semibold text-gray-700">
										Project Images <span className="text-red-600">*</span>
									</h2>
									<p className="mt-1 text-xs text-gray-500">Upload project screenshots or images (at least 1 required)</p>
								</div>
								{formData.images.length > 0 && (
									<label className="cursor-pointer">
										<Button type="button" size="sm" disabled={uploading} asChild>
											<span>
												{uploading ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Uploading...
													</>
												) : (
													<>
														<Plus className="mr-2 h-4 w-4" />
														Add Images
													</>
												)}
											</span>
										</Button>
										<input type="file" accept="image/*" multiple onChange={handleImageChange} disabled={uploading} className="hidden" />
									</label>
								)}
							</div>
							<div className="p-6">
								{formData.images.length > 0 ? (
									<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
										{formData.images.map((url, idx) => (
											<div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
												<img src={url} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
												<div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
													<button type="button" onClick={() => removeImage(idx)} className="rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700">
														<X className="h-4 w-4" />
													</button>
												</div>
												<div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">#{idx + 1}</div>
											</div>
										))}
									</div>
								) : (
									<label className="flex aspect-video h-54 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:bg-gray-50">
										{uploading ? (
											<>
												<Loader2 className="mb-3 h-12 w-12 animate-spin text-gray-400" />
												<span className="text-sm text-gray-500">Uploading images...</span>
											</>
										) : (
											<>
												<Upload className="mb-3 h-12 w-12 text-gray-400" />
												<span className="mb-1 text-sm font-medium text-gray-700">Click to upload images</span>
												<span className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</span>
											</>
										)}
										<input type="file" accept="image/*" multiple onChange={handleImageChange} disabled={uploading} className="hidden" />
									</label>
								)}
							</div>
						</div>
					</TabsContent>

					<TabsContent value="links" className="space-y-6">
						<div className="overflow-hidden rounded-lg border bg-white shadow-sm">
							<div className="border-b bg-gray-50 px-6 py-4">
								<h2 className="text-base font-semibold text-gray-700">Timeline & Links</h2>
							</div>
							<div className="space-y-5 p-6">
								<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-700">
											Start Date <span className="text-red-600">*</span>
										</label>
										<input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none" required />
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-700">
											End Date <span className="text-red-600">*</span>
										</label>
										<input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none" required />
									</div>
								</div>

								<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-700">GitHub URL</label>
										<input type="url" name="link_github" value={formData.link_github} onChange={handleChange} placeholder="https://github.com/..." className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none" />
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-700">Demo URL</label>
										<input type="url" name="link_demo" value={formData.link_demo} onChange={handleChange} placeholder="https://..." className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none" />
									</div>
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="advanced" className="space-y-6">
						<div className="overflow-hidden rounded-lg border bg-white shadow-sm">
							<div className="border-b bg-gray-50 px-6 py-4">
								<h2 className="text-base font-semibold text-gray-700">Environment Variables</h2>
								<p className="mt-1 text-xs text-gray-500">Optional configuration for development setup</p>
							</div>
							<div className="p-6">
								<textarea
									name="env"
									value={formData.env}
									onChange={handleChange}
									placeholder="KEY=VALUE&#10;PORT=3000&#10;DATABASE_URL=..."
									className="min-h-48 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none"
								/>
							</div>
						</div>
					</TabsContent>
				</Tabs>

				<div className="flex items-center justify-end">
					<Button type="submit" size="default" disabled={uploading}>
						{uploading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Uploading...
							</>
						) : (
							<>{isEdit ? "Update Project" : "Create Project"}</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
