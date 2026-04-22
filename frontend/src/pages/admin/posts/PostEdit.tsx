import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { postsApi, tagsApi } from "@/utils/adminApi";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TagInput, type Tag as TagOption } from "@/components/tag-input";
import AdminLayout from "@/layouts/adminLayout";
import { ImageUploader } from "@/components/ImageUploader";
import { Badge } from "@/components/ui/badge";
import { DateTimePicker24h } from "@/components/date-picker";
import { Editor } from "@/components/blocks/editor-x/editor";
import type { SerializedEditorState } from "lexical";

interface Tag {
	id: string;
	name: string;
}

interface Post {
	id: string;
	title: string;
	description?: string;
	content: string;
	thumbnail?: string;
	tagIds?: string[];
	tagId?: string;
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export default function EditPostPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
	const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
	const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
	const [localThumbnailPreview, setLocalThumbnailPreview] = useState<string | null>(null);
	const [postData, setPostData] = useState<Post | null>(null);
	const formRef = useRef<HTMLFormElement | null>(null);
	const openThumbnailPickerRef = useRef<(() => void) | null>(null);
	const allTagOptions = useMemo<TagOption<string>[]>(() => tags.map((t) => ({ label: t.name, value: t.id })), [tags]);
	const [selectedTagOptions, setSelectedTagOptions] = useState<TagOption<string>[]>([]);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		content: "",
		thumbnail: "",
		tagIds: [] as string[],
		status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
	});

	const editorSerializedState = useMemo<SerializedEditorState | undefined>(() => {
		if (!formData.content) return undefined;

		try {
			return JSON.parse(formData.content) as SerializedEditorState;
		} catch {
			return undefined;
		}
	}, [formData.content]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// Fetch tags
				const tagsData = await tagsApi.getAll(1, 100);
				const fetchedTags: Tag[] = tagsData.data || [];
				setTags(fetchedTags);

				// Fetch post
				if (id) {
					const postResponse = await postsApi.getById(id);
					const post = postResponse.data || postResponse;
					setPostData(post);
					const initialTagIds: string[] = Array.isArray(post.tagIds) ? post.tagIds : post.tagId ? [post.tagId] : [];
					setFormData({
						title: post.title || "",
						description: post.description || "",
						content: post.content || "",
						thumbnail: post.thumbnail || "",
						tagIds: initialTagIds,
						status: post.status || "DRAFT",
					});

					const tagOptions: TagOption<string>[] = fetchedTags.map((t) => ({ label: t.name, value: t.id }));
					setSelectedTagOptions(tagOptions.filter((opt) => initialTagIds.includes(opt.value)));
					if (post.thumbnail) {
						setThumbnailPreview(post.thumbnail);
					}
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Failed to load post");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

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
				...formData,
				status,
			};

			await postsApi.update(id!, payload);
			toast.success("Post updated successfully");
			navigate("/admin/posts");
		} catch (error: any) {
			console.error("Error updating post:", error);
			toast.error(error.response?.data?.message || "Failed to update post");
		} finally {
			setSaving(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await submitPost(formData.status);
	};

	const handleDraftClick = () => {
		setFormData((prev) => ({ ...prev, status: "DRAFT" }));
		queueMicrotask(() => {
			formRef.current?.requestSubmit();
		});
	};

	const handlePublishClick = () => {
		setFormData((prev) => ({ ...prev, status: "PUBLISHED" }));
		queueMicrotask(() => {
			formRef.current?.requestSubmit();
		});
	};

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			await postsApi.delete(id!);
			toast.success("Post deleted successfully");
			navigate("/admin/posts");
		} catch (error: any) {
			console.error("Error deleting post:", error);
			toast.error("Failed to delete post");
		} finally {
			setIsDeleting(false);
		}
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="flex h-96 items-center justify-center">
					<p className="text-muted-foreground">Loading post...</p>
				</div>
			</AdminLayout>
		);
	}

	if (!postData) {
		return (
			<AdminLayout>
				<div className="flex h-96 flex-col items-center justify-center gap-4">
					<p className="text-muted-foreground">Post not found</p>
					<Button onClick={() => navigate("/admin/posts")}>Back to Posts</Button>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="min-w-0 space-y-6">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
						<p className="text-muted-foreground mt-2">Update your post details</p>
					</div>
					<div className="flex items-center gap-2">
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
						<Button variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)}>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</Button>
					</div>
				</div>

				<form ref={formRef} onSubmit={handleSubmit} className="space-y-6 pb-28">
					<div className="flex gap-8">
						<div className="w-full">
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
											maxSize={10 * 1024 * 1024}
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

							<div className="mt-4">
								<Label className="mb-2" htmlFor="title">
									Title *
								</Label>
								<Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter post title" required />
							</div>

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

					<Editor
						editorSerializedState={editorSerializedState}
						onSerializedChange={(nextEditorSerializedState) => {
							setFormData((prev) => ({
								...prev,
								content: JSON.stringify(nextEditorSerializedState),
							}));
						}}
					/>

					<div className="fixed inset-x-0 bottom-4 z-50 px-4">
						<div className="bg-background/95 supports-backdrop-filter:bg-background/80 mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 rounded-2xl border p-3 shadow-xl backdrop-blur">
							<div className="order-2 w-full sm:order-1 sm:w-auto">
								<DateTimePicker24h />
							</div>
							<div className="order-1 flex w-full flex-wrap items-center justify-end gap-2 sm:order-2 sm:w-auto">
								<Button type="button" variant="outline" className="border-2 border-red-200 text-red-500 hover:bg-red-500 hover:text-white" onClick={() => navigate("/admin/posts")}>
									Cancel
								</Button>
								<Button type="button" variant="secondary" disabled={saving} onClick={handleDraftClick}>
									{saving && formData.status === "DRAFT" ? "Saving..." : "Save Draft"}
								</Button>
								<Button type="button" disabled={saving} onClick={handlePublishClick}>
									{saving ? "Updating..." : "Update & Publish"}
								</Button>
							</div>
						</div>
					</div>
				</form>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Post</DialogTitle>
						<DialogDescription>Are you sure you want to delete this post? This action cannot be undone.</DialogDescription>
					</DialogHeader>
					<div className="mt-4 flex justify-end gap-2">
						<Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
							{isDeleting ? "Deleting..." : "Delete"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</AdminLayout>
	);
}
