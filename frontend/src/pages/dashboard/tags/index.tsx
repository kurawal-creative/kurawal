import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { tagsApi } from "@/utils/adminApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, Plus, Search, Filter, ArrowUpDown, MoreHorizontal, Tag as TagIcon } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/layouts/adminLayout";

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
			<div className="space-y-5">
				{/* Header */}
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">Tags Management</h1>
						<p className="text-muted-foreground mt-1 text-sm">Organize and categorize your content with tags.</p>
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

				<div className="bg-card rounded-xl border">
					{/* Toolbar */}
					<div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex items-center gap-2">
							<div className="relative w-full lg:w-92">
								<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
								<Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search tags..." className="h-9 pl-9" />
							</div>
						</div>

						<div className="flex gap-2">
							<Button variant="outline" size="icon" className="h-9 w-10">
								<Filter className="h-4 w-4" />
							</Button>

							<Button variant="outline" size="icon" className="h-9 w-10">
								<ArrowUpDown className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Table */}
					{loading ? (
						<div className="space-y-3 p-6">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="flex items-center gap-4">
									<Skeleton className="h-12 flex-1" />
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-4 w-24" />
								</div>
							))}
						</div>
					) : tags.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-10">
							<div className="bg-muted/50 mb-3 flex h-14 w-14 items-center justify-center rounded-full">
								<TagIcon className="text-muted-foreground h-7 w-7" />
							</div>

							<p className="text-sm font-medium">No tags found</p>

							<p className="text-muted-foreground mt-1 text-xs">Try changing the search term or create a new tag.</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/30 hover:bg-muted/30">
									<TableHead className="w-14">No.</TableHead>
									<TableHead>Tag Name</TableHead>
									<TableHead>Slug</TableHead>
									<TableHead>Created</TableHead>
									<TableHead className="w-14">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{tags.map((tag, index) => (
									<TableRow key={tag.id} className="group">
										<TableCell className="text-muted-foreground">{index + 1}</TableCell>

										<TableCell>
											<span className="font-medium">{tag.name}</span>
										</TableCell>

										<TableCell>
											<Badge variant="outline" className="font-mono text-xs">
												{tag.slug}
											</Badge>
										</TableCell>

										<TableCell className="text-muted-foreground">
											{new Date(tag.createdAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</TableCell>

										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>

												<DropdownMenuContent align="end">
													<DropdownMenuItem onClick={() => handleEdit(tag)}>
														<Pencil className="mr-2 h-4 w-4" />
														Edit
													</DropdownMenuItem>

													<DropdownMenuSeparator />

													<DropdownMenuItem
														variant="destructive"
														onClick={() => {
															setDeleteTagId(tag.id);
															setIsDeleteOpen(true);
														}}
													>
														<Trash2 className="mr-2 h-4 w-4" />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-end gap-2 border-t p-4">
							<Button
								variant="outline"
								size="sm"
								disabled={currentPage === 1}
								onClick={() => {
									setCurrentPage(currentPage - 1);
									fetchTags(currentPage - 1);
								}}
							>
								Previous
							</Button>
							<div className="flex items-center gap-2">
								<span className="text-muted-foreground text-sm">
									Page {currentPage} of {totalPages}
								</span>
							</div>
							<Button
								variant="outline"
								size="sm"
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
				</div>
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
