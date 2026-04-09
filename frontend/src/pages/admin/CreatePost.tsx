import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { postsApi, tagsApi, mediaApi } from "@/utils/adminApi";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface Tag {
	id: string;
	name: string;
}

export default function CreatePostPage() {
	const navigate = useNavigate();
	const [tags, setTags] = useState<Tag[]>([]);
	const [saving, setSaving] = useState(false);
	const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
	const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		content: "",
		type_post: "POST" as "POST" | "PROJECT",
		link_github: "",
		thumbnail: "",
		tagId: "",
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

	const handleThumbnailUpload = async (file: File) => {
		try {
			setUploadingThumbnail(true);

			// Get upload signature
			const signatureData = await mediaApi.getUploadSignature(file.name, "post-thumbnails");

			// Upload to Cloudinary
			const formDataUpload = new FormData();
			formDataUpload.append("file", file);
			formDataUpload.append("timestamp", signatureData.timestamp);
			formDataUpload.append("signature", signatureData.signature);
			formDataUpload.append("api_key", signatureData.api_key);
			formDataUpload.append("folder", signatureData.folder);
			formDataUpload.append("public_id", signatureData.public_id);

			const response = await axios.post(signatureData.cloudinary_url, formDataUpload);

			// Set thumbnail URL
			const thumbnailUrl = response.data.secure_url;
			setFormData((prev) => ({ ...prev, thumbnail: thumbnailUrl }));
			setThumbnailPreview(thumbnailUrl);
			toast.success("Thumbnail uploaded successfully");
		} catch (error: any) {
			console.error("Error uploading thumbnail:", error);
			toast.error("Failed to upload thumbnail");
		} finally {
			setUploadingThumbnail(false);
		}
	};

	const handleThumbnailRemove = () => {
		setFormData((prev) => ({ ...prev, thumbnail: "" }));
		setThumbnailPreview("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (!formData.title || !formData.content || !formData.tagId) {
				toast.error("Title, content, and tag are required");
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
			<div className="space-y-6 pb-8">
				<div className="flex items-center gap-4">
					<Button variant="outline" size="sm" onClick={() => navigate("/admin/posts")}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
						<p className="text-muted-foreground mt-2">Add a new post or project to your content</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Main Content Card */}
					<Card>
						<CardHeader>
							<CardTitle>Post Details</CardTitle>
							<CardDescription>Basic information about your post</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Thumbnail Section */}
							<div className="space-y-2">
								<Label>Thumbnail Image *</Label>
								{thumbnailPreview ? (
									<div className="relative inline-block">
										<img src={thumbnailPreview} alt="Thumbnail preview" className="h-40 w-auto rounded-lg border object-cover" />
										<button type="button" onClick={handleThumbnailRemove} className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600">
											<X className="h-4 w-4" />
										</button>
									</div>
								) : (
									<label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400">
										<Upload className="h-5 w-5 text-gray-500" />
										<span className="text-sm text-gray-600">Click to upload thumbnail</span>
										<input
											type="file"
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													handleThumbnailUpload(file);
												}
											}}
											disabled={uploadingThumbnail}
											className="hidden"
										/>
									</label>
								)}
								{uploadingThumbnail && <p className="text-sm text-gray-500">Uploading...</p>}
							</div>

							{/* Title */}
							<div className="space-y-2">
								<Label htmlFor="title">Title *</Label>
								<Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter post title" required />
							</div>

							{/* Description */}
							<div className="space-y-2">
								<Label htmlFor="description">Description</Label>
								<Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of your post" rows={2} />
							</div>

							{/* Type */}
							<div className="space-y-2">
								<Label htmlFor="type">Type *</Label>
								<Select value={formData.type_post} onValueChange={(val: any) => setFormData({ ...formData, type_post: val })}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="POST">Post</SelectItem>
										<SelectItem value="PROJECT">Project</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Tag */}
							<div className="space-y-2">
								<Label htmlFor="tag">Tag *</Label>
								<Select value={formData.tagId} onValueChange={(val) => setFormData({ ...formData, tagId: val })}>
									<SelectTrigger>
										<SelectValue placeholder="Select a tag" />
									</SelectTrigger>
									<SelectContent>
										{tags.map((tag) => (
											<SelectItem key={tag.id} value={tag.id}>
												{tag.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* GitHub Link */}
							<div className="space-y-2">
								<Label htmlFor="github">GitHub Link</Label>
								<Input id="github" type="url" value={formData.link_github} onChange={(e) => setFormData({ ...formData, link_github: e.target.value })} placeholder="https://github.com/..." />
							</div>

							{/* Status */}
							<div className="space-y-2">
								<Label htmlFor="status">Status *</Label>
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
						</CardContent>
					</Card>

					{/* Content Card */}
					<Card>
						<CardHeader>
							<CardTitle>Content</CardTitle>
							<CardDescription>Write your post content using Markdown syntax</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="content">Content *</Label>
							<Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write your content here. Supports Markdown syntax..." rows={12} className="font-mono text-sm" required />
							<p className="text-muted-foreground text-xs">Supports Markdown: **bold**, *italic*, `code`, [links](url), # Headings, - Lists, etc.</p>
						</CardContent>
					</Card>

					{/* Actions */}
					<div className="flex gap-2">
						<Button type="button" variant="outline" onClick={() => navigate("/admin/posts")}>
							Cancel
						</Button>
						<Button type="submit" disabled={saving}>
							{saving ? "Creating..." : "Create Post"}
						</Button>
					</div>
				</form>
			</div>
		</AdminLayout>
	);
}
