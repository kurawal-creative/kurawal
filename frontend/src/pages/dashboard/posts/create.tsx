import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { postsApi, tagsApi } from "@/utils/adminApi";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Save, FileText, Settings } from "lucide-react";
import { toast } from "sonner";
import { type Tag as TagOption } from "@/components/tag-input";
import AdminLayout from "@/layouts/adminLayout";
import { ContentTab } from "@/components/dashboard/posts/tabs/ContentTab";
import { SettingsTab } from "@/components/dashboard/posts/tabs/SettingsTab";

interface Tag {
	id: string;
	name: string;
}

export default function CreatePostPage() {
	const navigate = useNavigate();
	const [tags, setTags] = useState<Tag[]>([]);
	const [saving, setSaving] = useState(false);
	const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
	const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
	const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
	const [localThumbnailPreview, setLocalThumbnailPreview] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement | null>(null);
	const openThumbnailPickerRef = useRef<(() => void) | null>(null);
	const allTagOptions = useMemo<TagOption<string>[]>(() => tags.map((t) => ({ label: t.name, value: t.id })), [tags]);
	const [selectedTagOptions, setSelectedTagOptions] = useState<TagOption<string>[]>([]);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		content: "",
		thumbnail: "",
		tagIds: [] as string[],
		status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
	});

	useEffect(() => {
		const fetchTags = async () => {
			try {
				const data = await tagsApi.getAll(1, 100);
				setTags(data.data || []);
			} catch (error) {
				console.error("Error fetching tags:", error);
				toast.error("Failed to fetch tags");
			}
		};

		fetchTags();
	}, []);

	useEffect(() => {
		return () => {
			if (localThumbnailPreview) {
				URL.revokeObjectURL(localThumbnailPreview);
			}
		};
	}, [localThumbnailPreview]);

	const handleThumbnailUpload = async (file: File) => {
		const localPreviewUrl = URL.createObjectURL(file);
		setThumbnailPreview(localPreviewUrl);
		setLocalThumbnailPreview(localPreviewUrl);
		setThumbnailUploadProgress(0);

		try {
			setUploadingThumbnail(true);

			const response = await uploadToCloudinary(file, {
				onProgress: ({ percent }) => {
					setThumbnailUploadProgress(percent);
				},
			});

			const thumbnailUrl = response.secure_url;
			setFormData((prev) => ({ ...prev, thumbnail: thumbnailUrl }));
			setThumbnailPreview(thumbnailUrl);
			if (localPreviewUrl) {
				URL.revokeObjectURL(localPreviewUrl);
				setLocalThumbnailPreview(null);
			}
			setThumbnailUploadProgress(100);
			toast.success("Thumbnail uploaded successfully");
		} catch (error: unknown) {
			console.error("Error uploading thumbnail:", error);
			if (localPreviewUrl) {
				URL.revokeObjectURL(localPreviewUrl);
				setLocalThumbnailPreview(null);
			}
			setThumbnailPreview("");
			setThumbnailUploadProgress(0);
			toast.error("Failed to upload thumbnail");
		} finally {
			setUploadingThumbnail(false);
		}
	};

	const handleThumbnailRemove = () => {
		if (localThumbnailPreview) {
			URL.revokeObjectURL(localThumbnailPreview);
			setLocalThumbnailPreview(null);
		}
		setFormData((prev) => ({ ...prev, thumbnail: "" }));
		setThumbnailPreview("");
		setThumbnailUploadProgress(0);
	};

	const handleThumbnailEdit = () => {
		openThumbnailPickerRef.current?.();
	};

	const submitPost = async (status: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
		try {
			if (!formData.title || !formData.content || formData.tagIds.length === 0) {
				toast.error("Title, content, and at least one tag are required");
				return;
			}

			if (!formData.thumbnail) {
				toast.error("Thumbnail is required");
				return;
			}

			setSaving(true);
			const payload = {
				title: formData.title,
				description: formData.description || "",
				content: formData.content,
				thumbnail: formData.thumbnail,
				tagIds: formData.tagIds,
				status,
			};

			await postsApi.create(payload);
			
			const statusMessages = {
				DRAFT: "saved as draft",
				PUBLISHED: "published",
				ARCHIVED: "archived"
			};
			
			toast.success(`Post ${statusMessages[status]} successfully`);
			navigate("/dashboard/posts");
		} catch (error: unknown) {
			console.error("Error saving post:", error);
			const errorMessage = error && typeof error === "object" && "response" in error ? (error.response as { data?: { message?: string } })?.data?.message : undefined;
			toast.error(errorMessage || "Failed to save post");
		} finally {
			setSaving(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await submitPost(formData.status);
	};

	const handleSaveAsDraft = async () => {
		await submitPost("DRAFT");
	};

	const handleSaveAsArchived = async () => {
		await submitPost("ARCHIVED");
	};

	const handlePublish = async () => {
		await submitPost("PUBLISHED");
	};

	// Determine button text and action based on current status
	const getActionButton = () => {
		switch (formData.status) {
			case "DRAFT":
				return {
					text: "Save as Draft",
					action: handleSaveAsDraft,
					variant: "default" as const,
				};
			case "ARCHIVED":
				return {
					text: "Save as Archived",
					action: handleSaveAsArchived,
					variant: "secondary" as const,
				};
			case "PUBLISHED":
				return {
					text: "Publish",
					action: handlePublish,
					variant: "default" as const,
				};
		}
	};

	const actionButton = getActionButton();

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">Create Post</h1>
						<p className="text-muted-foreground mt-1 text-sm">Write and publish a new blog post or article.</p>
					</div>

					<div className="flex gap-2">
						<Select
							value={formData.status}
							onValueChange={(val: "DRAFT" | "PUBLISHED" | "ARCHIVED") =>
								setFormData({
									...formData,
									status: val,
								})
							}
						>
							<SelectTrigger className="h-9 w-32">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="DRAFT">Draft</SelectItem>
								<SelectItem value="PUBLISHED">Published</SelectItem>
								<SelectItem value="ARCHIVED">Archived</SelectItem>
							</SelectContent>
						</Select>

						<Button variant={actionButton.variant} size="sm" onClick={actionButton.action} disabled={saving}>
							<Save className="mr-2 h-4 w-4" />
							{saving ? "Saving..." : actionButton.text}
						</Button>
					</div>
				</div>

				<form ref={formRef} onSubmit={handleSubmit}>
					<Tabs defaultValue="content">
						<TabsList className="bg-muted h-auto w-full justify-start overflow-x-auto rounded-lg p-1">
							<TabsTrigger value="content" className="data-[state=active]:bg-background">
								<FileText className="mr-2 h-4 w-4" />
								Content
							</TabsTrigger>

							<TabsTrigger value="settings" className="data-[state=active]:bg-background">
								<Settings className="mr-2 h-4 w-4" />
								Settings
							</TabsTrigger>
						</TabsList>

						<TabsContent value="content">
							<ContentTab
								formData={formData}
								thumbnailPreview={thumbnailPreview}
								uploadingThumbnail={uploadingThumbnail}
								thumbnailUploadProgress={thumbnailUploadProgress}
								openThumbnailPickerRef={openThumbnailPickerRef}
								onTitleChange={(title) => setFormData((prev) => ({ ...prev, title }))}
								onContentChange={(content) => setFormData((prev) => ({ ...prev, content }))}
								onThumbnailUpload={handleThumbnailUpload}
								onThumbnailEdit={handleThumbnailEdit}
								onThumbnailRemove={handleThumbnailRemove}
							/>
						</TabsContent>

						<TabsContent value="settings">
							<SettingsTab
								formData={formData}
								thumbnailPreview={thumbnailPreview}
								selectedTagOptions={selectedTagOptions}
								allTagOptions={allTagOptions}
								onDescriptionChange={(description) => setFormData((prev) => ({ ...prev, description }))}
								onTagsChange={(tags) => {
									setSelectedTagOptions(tags);
									setFormData((prev) => ({
										...prev,
										tagIds: tags.map((t) => t.value),
									}));
								}}
							/>
						</TabsContent>
					</Tabs>
				</form>
			</div>
		</AdminLayout>
	);
}
