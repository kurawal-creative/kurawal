import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { postsApi, tagsApi } from "@/utils/adminApi";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { type Tag as TagOption } from "@/components/tag-input";
import AdminLayout from "@/layouts/adminLayout";
import { ContentTab } from "@/components/dashboard/posts/tabs/ContentTab";
import { SettingsTab } from "@/components/dashboard/posts/tabs/SettingsTab";
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
	const [activeTab, setActiveTab] = useState("content");

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

				const tagsData = await tagsApi.getAll(1, 100);
				const fetchedTags: Tag[] = tagsData.data || [];
				setTags(fetchedTags);

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
				...formData,
				status,
			};

			await postsApi.update(id!, payload);
			toast.success(`Post ${status === "DRAFT" ? "saved as draft" : "updated"} successfully`);
			navigate("/dashboard/posts");
		} catch (error: unknown) {
			console.error("Error updating post:", error);
			const errorMessage = error && typeof error === "object" && "response" in error ? (error.response as { data?: { message?: string } })?.data?.message : undefined;
			toast.error(errorMessage || "Failed to update post");
		} finally {
			setSaving(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await submitPost(formData.status);
	};

	const handlePublishClick = async () => {
		await submitPost("PUBLISHED");
	};

	const handleSaveDraft = async () => {
		await submitPost("DRAFT");
	};

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			await postsApi.delete(id!);
			toast.success("Post deleted successfully");
			navigate("/dashboard/posts");
		} catch (error: unknown) {
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
					<Button onClick={() => navigate("/dashboard/posts")}>Back to Posts</Button>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="bg-background min-h-screen">
				<div>
					<div className="bg-background/80 border-border/50 rounded-2xl border shadow-sm backdrop-blur-xl">
						{/* TOP NAV */}
						<div className="flex items-center justify-between p-4">
							{/* LEFT */}
							<div className="flex items-center gap-3">
								<div className="flex flex-col">
									<span className="text-sm font-semibold">{formData.title?.trim() || "Edit Post"}</span>
									<span className="text-muted-foreground text-xs">Edit mode</span>
								</div>
							</div>

							{/* RIGHT */}
							<div className="flex items-center gap-2">
								{/* STATUS */}
								<div className="flex items-center gap-2">
									<Select value={formData.status} onValueChange={(val: "DRAFT" | "PUBLISHED" | "ARCHIVED") => setFormData({ ...formData, status: val })}>
										<SelectTrigger className="border-border/60 bg-muted/40 min-w-30 text-xs shadow-none">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="DRAFT">Draft</SelectItem>
											<SelectItem value="PUBLISHED">Published</SelectItem>
											<SelectItem value="ARCHIVED">Archived</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* DELETE */}
								<Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(true)} className="border-border/60 bg-background text-destructive hover:text-destructive  shadow-xs">
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</Button>

								{/* SAVE */}
								<Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={saving} className="border-border/60 bg-background  shadow-xs">
									<Save className="mr-2 h-4 w-4" />
									Save
								</Button>

								{/* PUBLISH */}
								<Button size="sm" onClick={handlePublishClick} disabled={saving} className=" px-4 shadow-sm">
									{saving ? "Updating..." : "Update"}
								</Button>
							</div>
						</div>

						{/* TAB NAV */}
						<div className="p-4">
							<div className="bg-muted flex w-full rounded-xl p-1">
								<button onClick={() => setActiveTab("content")} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${activeTab === "content" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
									Content
								</button>

								<button onClick={() => setActiveTab("settings")} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${activeTab === "settings" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
									Settings
								</button>
							</div>
						</div>
					</div>

					<form ref={formRef} onSubmit={handleSubmit}>
						{/* Content Tab */}
						{activeTab === "content" && (
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
								editorSerializedState={editorSerializedState}
							/>
						)}

						{/* Settings Tab */}
						{activeTab === "settings" && (
							<SettingsTab
								formData={formData}
								thumbnailPreview={thumbnailPreview}
								selectedTagOptions={selectedTagOptions}
								allTagOptions={allTagOptions}
								onDescriptionChange={(description) => setFormData((prev) => ({ ...prev, description }))}
								onTagsChange={(tags) => {
									setSelectedTagOptions(tags);
									setFormData((prev) => ({ ...prev, tagIds: tags.map((t) => t.value) }));
								}}
							/>
						)}
					</form>
				</div>
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
