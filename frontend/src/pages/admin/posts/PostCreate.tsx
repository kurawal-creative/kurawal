import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { postsApi, tagsApi } from "@/utils/adminApi";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TagInput, type Tag as TagOption } from "@/components/tag-input";
import { ImageUploader } from "@/components/ImageUploader";
import AdminLayout from "@/layouts/adminLayout";
import { Badge } from "@/components/ui/badge";
import { DateTimePicker24h } from "@/components/date-picker";
import { Editor } from "@/components/blocks/editor-x/editor";

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
	const [uploadingContent, setUploadingContent] = useState(false);
	const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
	const [localThumbnailPreview, setLocalThumbnailPreview] = useState<string | null>(null);
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

	const previewContent = useMemo(() => {
		const plainText = formData.content
			.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
			.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
			.replace(/[`*_>#-]/g, " ")
			.replace(/\s+/g, " ")
			.trim();

		return plainText || "Konten preview akan tampil di sini saat kamu menulis isi post.";
	}, [formData.content]);

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

			// Upload to Cloudinary using common utility
			const response = await uploadToCloudinary(file, {
				onProgress: ({ percent }) => {
					setThumbnailUploadProgress(percent);
				},
			});

			// Set thumbnail URL
			const thumbnailUrl = response.secure_url;
			setFormData((prev) => ({ ...prev, thumbnail: thumbnailUrl }));
			setThumbnailPreview(thumbnailUrl);
			if (localPreviewUrl) {
				URL.revokeObjectURL(localPreviewUrl);
				setLocalThumbnailPreview(null);
			}
			setThumbnailUploadProgress(100);
			toast.success("Thumbnail uploaded successfully");
		} catch (error: any) {
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

	const handleContentImageUpload = async (file: File) => {
		try {
			setUploadingContent(true);
			const response = await uploadToCloudinary(file);
			const imageUrl = `\n![image](${response.secure_url})\n`;
			setFormData((prev) => ({ ...prev, content: prev.content + imageUrl }));
			toast.success("Image inserted into content");
		} catch (error: any) {
			console.error("Error uploading image:", error);
			toast.error("Failed to upload image");
		} finally {
			setUploadingContent(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (!formData.title || !formData.content || formData.tagIds.length === 0) {
				toast.error("Title, content, and at least one tag are required");
				return;
			}

			setSaving(true);
			await postsApi.create(formData);
			toast.success("Post created successfully");
			navigate("/admin/posts");
		} catch (error: any) {
			console.error("Error creating post:", error);
			toast.error(error.response?.data?.message || "Failed to create post");
		} finally {
			setSaving(false);
		}
	};
	return (
		<AdminLayout>
			<div className="min-w-0 space-y-6">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
						<p className="text-muted-foreground mt-2">Add a new post or project to your content</p>
					</div>
					{/* Status */}
					<Select value={formData.status} onValueChange={(val: any) => setFormData({ ...formData, status: val })}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="DRAFT">Draft</SelectItem>
							<SelectItem value="PUBLISHED">Published</SelectItem>
							<SelectItem value="ARCHIVED">Archived</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Main Content Card */}
					<div className="flex gap-8">
						<div className="w-full">
							{/* Thumbnail Section */}
							<div className="space-y-2">
								<ImageUploader
									showDropzone={false}
									aspectRatio={16 / 9}
									maxSize={10 * 1024 * 1024}
									acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
									registerOpenFileDialog={(openDialog) => {
										openThumbnailPickerRef.current = openDialog;
									}}
									onImageCropped={(blob) => {
										const file = new File([blob], `thumbnail-${Date.now()}.jpg`, {
											type: blob.type || "image/jpeg",
										});
										void handleThumbnailUpload(file);
									}}
								/>

								{thumbnailPreview ? (
									<div className="group relative inline-block overflow-hidden rounded-lg border">
										<img src={thumbnailPreview} alt="Thumbnail preview" className={`h-40 w-auto rounded-lg object-cover transition-opacity duration-300 ${uploadingThumbnail ? "opacity-80" : "opacity-100"}`} />

										<div className={`absolute inset-0 z-10 flex items-center justify-center bg-black/55 backdrop-blur-[1px] transition-opacity duration-300 ${uploadingThumbnail ? "opacity-100" : "pointer-events-none opacity-0"}`}>
											<div className="flex min-w-24 flex-col items-center gap-2 text-white">
												<div className="relative h-12 w-12">
													<svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36" aria-label={`Thumbnail upload progress ${thumbnailUploadProgress}%`} role="img">
														<path d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="3" />
														<path d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${thumbnailUploadProgress}, 100`} strokeLinecap="round" />
													</svg>
													<span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">{thumbnailUploadProgress}%</span>
												</div>
												<p className="text-xs text-white/85">Uploading...</p>
											</div>
										</div>
										<div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
											<Button type="button" variant="ghost" size="icon" onClick={handleThumbnailEdit} disabled={uploadingThumbnail} className="h-8 w-8 rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-black/65" aria-label="Edit thumbnail">
												<Pencil className="h-4 w-4" />
											</Button>
											<Button type="button" variant="ghost" size="icon" onClick={handleThumbnailRemove} disabled={uploadingThumbnail} className="h-8 w-8 rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-red-600/85" aria-label="Delete thumbnail">
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								) : (
									<div className="space-y-2">
										<ImageUploader
											aspectRatio={16 / 9}
											maxSize={10 * 1024 * 1024} // 10MB
											acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
											onImageCropped={(blob) => {
												const file = new File([blob], `thumbnail-${Date.now()}.jpg`, {
													type: blob.type || "image/jpeg",
												});
												void handleThumbnailUpload(file);
											}}
										/>
									</div>
								)}
							</div>

							{/* Title */}
							<div className="mt-4">
								<Label className="mb-2" htmlFor="title">
									Title *
								</Label>
								<Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter post title" required />
							</div>
							{/* Description */}
							<div className="mt-4">
								<Label className="mb-2" htmlFor="description">
									Description
								</Label>
								<Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of your post" rows={2} />
							</div>

							<div className="mt-4">
								<Label className="mb-2" htmlFor="description">
									Tag
								</Label>
								{/* Tag */}
								<TagInput
									tags={selectedTagOptions}
									setTags={(next) => {
										setSelectedTagOptions(next);
										setFormData((prev) => ({ ...prev, tagIds: next.map((t) => t.value) }));
									}}
									allTags={allTagOptions}
									placeholder="Search tag..."
								/>
							</div>
						</div>
						<Card className="relative mx-auto max-w-sm overflow-hidden pt-0">
							<div className="relative aspect-video">
								<img src={thumbnailPreview || "https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1200&auto=format&fit=crop"} alt="Post cover preview" className="h-full w-full object-cover" />
								<div className="absolute inset-0 bg-black/25" />
							</div>
							<CardHeader className="space-y-2">
								<div className="flex items-center justify-between">
									<Badge variant={formData.status === "PUBLISHED" ? "default" : "secondary"}>{formData.status}</Badge>
								</div>
								<CardTitle className="line-clamp-2">{formData.title.trim() || "Judul post akan tampil di sini"}</CardTitle>
								<CardDescription className="line-clamp-2">{formData.description.trim() || "Deskripsi singkat post akan tampil di sini"}</CardDescription>
							</CardHeader>
							<CardFooter>
								<Button type="button" variant="outline" className="w-full" disabled>
									Live Preview
								</Button>
							</CardFooter>
						</Card>
					</div>

					{/* Content Card */}

					<Card className="w-full min-w-0">
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Content</CardTitle>
								<CardDescription>Write your post content using Markdown syntax</CardDescription>
							</div>
							<div className="flex items-center gap-2">
								<label className="cursor-pointer">
									<Button type="button" variant="outline" size="sm" asChild disabled={uploadingContent}>
										<span>{uploadingContent ? "Uploading..." : "Insert Image"}</span>
									</Button>
									<input
										type="file"
										accept="image/*"
										multiple
										onChange={async (e) => {
											const files = e.target.files;
											if (!files) return;
											for (const file of Array.from(files)) {
												await handleContentImageUpload(file);
											}
										}}
										className="hidden"
									/>
								</label>
							</div>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="content">Content *</Label>
							<Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write your content here. Supports Markdown syntax..." rows={12} className="font-mono text-sm" required />
							{/* <Editor /> */}
							<p className="text-muted-foreground text-xs">Supports Markdown: **bold**, *italic*, `code`, [links](url), # Headings, - Lists, etc.</p>
						</CardContent>
					</Card>

					<Editor />
					{/* Actions */}
					<div className="flex gap-2">
						<Button type="button" variant="outline" onClick={() => navigate("/admin/posts")}>
							Cancel
						</Button>
						<Button type="submit" disabled={saving}>
							{saving ? "Creating..." : "Create Post"}
						</Button>
						<div>
							<DateTimePicker24h />
						</div>
					</div>
				</form>
			</div>
		</AdminLayout>
	);
}
