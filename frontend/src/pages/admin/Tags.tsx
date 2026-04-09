import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tagsApi } from "@/utils/adminApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Tag {
	id: string;
	name: string;
	slug: string;
	createdAt: string;
}

export default function AdminTagsPage() {
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingTag, setEditingTag] = useState<Tag | null>(null);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [deleteTagId, setDeleteTagId] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		slug: "",
	});

	const fetchTags = async (page: number) => {
		try {
			setLoading(true);
			const data = await tagsApi.getAll(page, 10, searchTerm);
			setTags(data.data || []);
			setTotalPages(data.pagination?.totalPages || 1);
		} catch (error) {
			console.error("Error fetching tags:", error);
			toast.error("Failed to fetch tags");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setCurrentPage(1);
		fetchTags(1);
	}, [searchTerm]);

	const handleCreateOrUpdate = async () => {
		try {
			if (!formData.name) {
				toast.error("Tag name is required");
				return;
			}

			if (editingTag) {
				await tagsApi.update(editingTag.id, formData);
				toast.success("Tag updated successfully");
			} else {
				await tagsApi.create(formData);
				toast.success("Tag created successfully");
			}

			setIsDialogOpen(false);
			setEditingTag(null);
			setFormData({ name: "", slug: "" });
			fetchTags(currentPage);
		} catch (error: any) {
			console.error("Error saving tag:", error);
			toast.error(error.response?.data?.message || "Failed to save tag");
		}
	};

	const handleEdit = (tag: Tag) => {
		setEditingTag(tag);
		setFormData({
			name: tag.name,
			slug: tag.slug,
		});
		setIsDialogOpen(true);
	};

	const handleDelete = async () => {
		if (!deleteTagId) return;

		try {
			await tagsApi.delete(deleteTagId);
			toast.success("Tag deleted successfully");
			setIsDeleteOpen(false);
			setDeleteTagId(null);
			fetchTags(currentPage);
		} catch (error: any) {
			console.error("Error deleting tag:", error);
			toast.error(error.response?.data?.message || "Failed to delete tag");
		}
	};

	const generateSlug = (text: string) => {
		return text
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
	};

	return (
		<AdminLayout>
			<div className="space-y-6 pb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Tags Management</h1>
						<p className="text-muted-foreground mt-2">Organize and manage your content tags</p>
					</div>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button
								onClick={() => {
									setEditingTag(null);
									setFormData({ name: "", slug: "" });
								}}
							>
								<Plus className="mr-2 h-4 w-4" />
								New Tag
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{editingTag ? "Edit Tag" : "Create New Tag"}</DialogTitle>
								<DialogDescription>{editingTag ? "Update tag details" : "Create a new content tag"}</DialogDescription>
							</DialogHeader>

							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Tag Name *</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) => {
											const name = e.target.value;
											setFormData({
												name,
												slug: formData.slug || generateSlug(name),
											});
										}}
										placeholder="e.g., React, Web Development"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="slug">Slug</Label>
									<Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="Will auto-generate if empty" />
									<p className="text-muted-foreground text-xs">Auto-generated from name if empty</p>
								</div>

								<div className="flex justify-end gap-2 pt-4">
									<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
										Cancel
									</Button>
									<Button onClick={handleCreateOrUpdate}>{editingTag ? "Update Tag" : "Create Tag"}</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				{/* Search */}
				<Input placeholder="Search by tag name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />

				{/* Table */}
				<Card>
					<CardHeader>
						<CardTitle>Tags</CardTitle>
						<CardDescription>Showing {tags.length} tags</CardDescription>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="space-y-2">
								{Array.from({ length: 5 }).map((_, i) => (
									<Skeleton key={i} className="h-12 w-full" />
								))}
							</div>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Slug</TableHead>
											<TableHead>Created</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{tags.length === 0 ? (
											<TableRow>
												<TableCell colSpan={4} className="text-muted-foreground py-8 text-center">
													No tags found
												</TableCell>
											</TableRow>
										) : (
											tags.map((tag) => (
												<TableRow key={tag.id}>
													<TableCell className="font-medium">{tag.name}</TableCell>
													<TableCell>
														<code className="rounded bg-gray-100 px-2 py-1 text-sm">{tag.slug}</code>
													</TableCell>
													<TableCell className="text-sm">{new Date(tag.createdAt).toLocaleDateString()}</TableCell>
													<TableCell className="text-right">
														<div className="flex justify-end gap-2">
															<Button size="sm" variant="outline" onClick={() => handleEdit(tag)}>
																<Pencil className="h-4 w-4" />
															</Button>
															<Button
																size="sm"
																variant="destructive"
																onClick={() => {
																	setDeleteTagId(tag.id);
																	setIsDeleteOpen(true);
																}}
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						)}

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="mt-4 flex justify-center gap-2">
								<Button
									variant="outline"
									disabled={currentPage === 1}
									onClick={() => {
										setCurrentPage(currentPage - 1);
										fetchTags(currentPage - 1);
									}}
								>
									Previous
								</Button>
								<div className="flex items-center gap-2">
									<span className="text-sm">
										Page {currentPage} of {totalPages}
									</span>
								</div>
								<Button
									variant="outline"
									disabled={currentPage === totalPages}
									onClick={() => {
										setCurrentPage(currentPage + 1);
										fetchTags(currentPage + 1);
									}}
								>
									Next
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Tag</DialogTitle>
						<DialogDescription>Are you sure you want to delete this tag? This action cannot be undone.</DialogDescription>
					</DialogHeader>
					<div className="mt-4 flex justify-end gap-2">
						<Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDelete}>
							Delete
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</AdminLayout>
	);
}
