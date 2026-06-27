import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { tagsApi } from "@/utils/adminApi";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Plus, FileText, ImageIcon } from "lucide-react";
import { type Tag as TagOption } from "@/components/tag-input";
import BasicTab from "./awards-tab/BasicTab";
import MediaTab from "./awards-tab/MediaTab";

interface Tag {
	id: string;
	name: string;
}

export default function AwardsFormDashboard() {
	const { id } = useParams();
	const isEdit = !!id;
	const navigate = useNavigate();
	const [loading, setLoading] = useState(isEdit);
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [tags, setTags] = useState<Tag[]>([]);
	const [selectedTagOptions, setSelectedTagOptions] = useState<TagOption<string>[]>([]);
	const [formData, setFormData] = useState({
		title: "",
		tagIds: [] as string[],
		images: [] as string[],
		date: "",
		description: "",
		institution: "",
		location: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch all tags
				const tagsData = await tagsApi.getAll(1, 100);
				setTags(tagsData.data || []);

				// Fetch award data if editing
				if (isEdit && id) {
					setLoading(true);
					try {
						// TODO: Replace with actual API call
						// const data = await awardsApi.getById(id);
						// const dateValue = data.date.split('T')[0];

						// setFormData({
						// 	title: data.title,
						// 	tagIds: data.tagIds,
						// 	images: data.images,
						// 	date: dateValue,
						// 	description: data.description,
						// 	institution: data.institution,
						// 	location: data.location,
						// });

						// const selectedTags = tagsData.data
						// 	.filter((tag: Tag) => data.tagIds.includes(tag.id))
						// 	.map((tag: Tag) => ({ label: tag.name, value: tag.id }));
						// setSelectedTagOptions(selectedTags);

						// Temporary: navigate back if no data
						toast.error("Award not found");
						navigate("/dashboard/awards");
					} catch (error) {
						console.error("Error fetching award:", error);
						toast.error("Failed to fetch award");
						navigate("/dashboard/awards");
					} finally {
						setLoading(false);
					}
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Failed to fetch data");
			}
		};

		fetchData();
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
			toast.success("Images uploaded successfully");
		} catch (error) {
			console.error("Error uploading images:", error);
			toast.error("Failed to upload images");
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (!formData.title.trim()) {
			toast.error("Award title is required");
			return;
		}

		if (formData.tagIds.length === 0) {
			toast.error("Please select at least one tag");
			return;
		}

		if (formData.images.length === 0) {
			toast.error("At least one award image is required");
			return;
		}

		if (!formData.date) {
			toast.error("Award date is required");
			return;
		}

		if (!formData.institution.trim()) {
			toast.error("Institution is required");
			return;
		}

		if (!formData.location.trim()) {
			toast.error("Location is required");
			return;
		}

		if (!formData.description.trim()) {
			toast.error("Description is required");
			return;
		}

		setSaving(true);

		try {
			if (isEdit) {
				// TODO: Replace with actual API call
				// await awardsApi.update(id!, formData);
				toast.success("Award updated successfully");
			} else {
				// TODO: Replace with actual API call
				// await awardsApi.create(formData);
				toast.success("Award created successfully");
			}
			navigate("/dashboard/awards");
		} catch (error) {
			console.error(`Error ${isEdit ? "updating" : "creating"} award:`, error);
			toast.error(`Failed to ${isEdit ? "update" : "create"} award`);
		} finally {
			setSaving(false);
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
					<h1 className="text-2xl font-semibold tracking-tight">{isEdit ? "Edit Award" : "Create Award"}</h1>
					<p className="text-muted-foreground mt-1 text-sm">{isEdit ? "Update award information and details." : "Add a new achievement or recognition to your portfolio."}</p>
				</div>

				<div className="flex gap-2">
					<Button asChild variant="outline" size="sm">
						<Link to="/dashboard/awards">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back
						</Link>
					</Button>

					<Button type="submit" form="award-form" disabled={saving || uploading} size="sm">
						{isEdit ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
						{saving ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Update Award" : "Publish Award"}
					</Button>
				</div>
			</div>

			<form id="award-form" onSubmit={handleSubmit}>
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
					</TabsList>

					<TabsContent value="basic">
						<BasicTab formData={formData} tags={tags} selectedTagOptions={selectedTagOptions} handleChange={handleChange} setFormData={setFormData} setSelectedTagOptions={setSelectedTagOptions} />
					</TabsContent>

					<TabsContent value="media">
						<MediaTab formData={formData} uploading={uploading} handleImageChange={handleImageChange} removeImage={removeImage} />
					</TabsContent>
				</Tabs>
			</form>
		</div>
	);
}
