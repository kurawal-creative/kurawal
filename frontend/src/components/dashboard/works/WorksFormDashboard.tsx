import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, FileText, ImageIcon, Link2, Settings2 } from "lucide-react";
import api from "@/utils/api";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicTab from "./works-tab/BasicTab";
import MediaTab from "./works-tab/MediaTab";
import LinksTab from "./works-tab/LinksTab";
import AdvancedTab from "./works-tab/AdvancedTab";

export default function WorksFormDashboard() {
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
		category: "",
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
					const response = await api.get(`/works/${id}`);
					const { name, description, images, stack, category, startDate, endDate, link_github, link_demo, status, env } = response.data;
					setFormData({
						name: name || "",
						description: description || "",
						images: images || [],
						stack: stack || [],
						category: category || "",
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
					navigate("/dashboard/project");
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
		} catch {
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
				await api.put(`/works/${id}`, formData);
			} else {
				await api.post("/works", formData);
			}
			navigate("/dashboard/project");
		} catch (error) {
			console.error("Failed to save project", error);
			alert("Error saving project");
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-64" />
					<div className="flex gap-2">
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-32" />
					</div>
				</div>
				<div className="bg-card rounded-xl border shadow-sm">
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
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">{isEdit ? "Edit Project" : "Create Project"}</h1>
					<p className="text-muted-foreground mt-1 text-sm">{isEdit ? "Update project information and assets." : "Add a new project to your portfolio."}</p>
				</div>

				<div className="flex gap-2">
					<Button asChild variant="outline" size="sm">
						<Link to="/dashboard/works">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back
						</Link>
					</Button>

					<Button type="submit" form="project-form" disabled={uploading} size="sm">
						{uploading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Uploading...
							</>
						) : (
							<>{isEdit ? "Update Project" : "Publish Project"}</>
						)}
					</Button>
				</div>
			</div>

			<form id="project-form" onSubmit={handleSave}>
				<Tabs defaultValue="basic" className="space-y-6">
					<TabsList className="bg-muted h-auto w-full justify-start overflow-x-auto rounded-lg p-1">
						<TabsTrigger value="basic" className="data-[state=active]:bg-background">
							<FileText className="mr-2 h-4 w-4" />
							Basic
						</TabsTrigger>

						<TabsTrigger value="media" className="data-[state=active]:bg-background">
							<ImageIcon className="mr-2 h-4 w-4" />
							Media
						</TabsTrigger>

						<TabsTrigger value="links" className="data-[state=active]:bg-background">
							<Link2 className="mr-2 h-4 w-4" />
							Links
						</TabsTrigger>

						<TabsTrigger value="advanced" className="data-[state=active]:bg-background">
							<Settings2 className="mr-2 h-4 w-4" />
							Advanced
						</TabsTrigger>
					</TabsList>

					<TabsContent value="basic">
						<BasicTab formData={formData} handleChange={handleChange} setFormData={setFormData} />
					</TabsContent>

					<TabsContent value="media">
						<MediaTab formData={formData} uploading={uploading} handleImageChange={handleImageChange} removeImage={removeImage} />
					</TabsContent>

					<TabsContent value="links">
						<LinksTab formData={formData} handleChange={handleChange} />
					</TabsContent>

					<TabsContent value="advanced">
						<AdvancedTab formData={formData} handleChange={handleChange} />
					</TabsContent>
				</Tabs>
			</form>
		</div>
	);
}
