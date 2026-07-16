import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { tagsApi } from "@/utils/adminApi";
import { toast } from "sonner";
import { generateTagColorHex } from "@/utils/tagColors";
import { Tag } from "@/pages/dashboard/tags/index";
import { TagFormDialog } from "./TagFormDialog";
import { TagDeleteDialog } from "./TagDeleteDialog";
import { TagsTable } from "./TagsTable";
import { TagsToolbar } from "./TagsToolbar";
import { TagsEmptyState } from "./TagsEmptyState";
import { TagsTableSkeleton } from "./TagsTableSkeleton";
import { TagsPagination } from "./TagsPagination";

interface TagsListDashboardProps {
	tags: Tag[];
	loading: boolean;
	searchTerm: string;
	setSearchTerm: (value: string) => void;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onTagChange: () => void;
}

export function TagsListDashboard({ tags, loading, searchTerm, setSearchTerm, currentPage, totalPages, onPageChange, onTagChange }: TagsListDashboardProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingTag, setEditingTag] = useState<Tag | null>(null);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [deleteTagId, setDeleteTagId] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		slug: "",
		color: "",
	});

	const generateSlug = (text: string) => {
		return text
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
	};

	const handleCreateOrUpdate = async () => {
		try {
			if (!formData.name) {
				toast.error("Tag name is required");
				return;
			}

			const payload = {
				...formData,
				color: formData.color || generateTagColorHex(formData.name),
			};

			if (editingTag) {
				await tagsApi.update(editingTag.id, payload);
				toast.success("Tag updated successfully");
			} else {
				await tagsApi.create(payload);
				toast.success("Tag created successfully");
			}

			setIsDialogOpen(false);
			setEditingTag(null);
			setFormData({ name: "", slug: "", color: "" });
			onTagChange();
		} catch (error: unknown) {
			console.error("Error saving tag:", error);
			const errorMessage = error && typeof error === "object" && "response" in error ? (error.response as { data?: { message?: string } })?.data?.message : undefined;
			toast.error(errorMessage || "Failed to save tag");
		}
	};

	const handleEdit = (tag: Tag) => {
		setEditingTag(tag);
		setFormData({
			name: tag.name,
			slug: tag.slug,
			color: tag.color || "",
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
			onTagChange();
		} catch (error: unknown) {
			console.error("Error deleting tag:", error);
			const errorMessage = error && typeof error === "object" && "response" in error ? (error.response as { data?: { message?: string } })?.data?.message : undefined;
			toast.error(errorMessage || "Failed to delete tag");
		}
	};

	return (
		<div className="space-y-5">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Tags Management</h1>
					<p className="text-muted-foreground mt-1 text-sm">Organize and categorize your content with tags.</p>
				</div>
				<Button
					onClick={() => {
						setEditingTag(null);
						setFormData({ name: "", slug: "", color: "" });
						setIsDialogOpen(true);
					}}
				>
					<Plus className="mr-2 h-4 w-4" />
					New Tag
				</Button>
			</div>

			<div className="bg-card rounded-xl border">
				<TagsToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

				{loading ? <TagsTableSkeleton /> : tags.length === 0 ? <TagsEmptyState /> : <TagsTable tags={tags} onEdit={handleEdit} onDelete={(id: string) => {
							setDeleteTagId(id);
							setIsDeleteOpen(true);
						}} />}

				{totalPages > 1 && <TagsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />}
			</div>

			<TagFormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} editingTag={editingTag} formData={formData} setFormData={setFormData} onSubmit={handleCreateOrUpdate} generateSlug={generateSlug} />

			<TagDeleteDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} />
		</div>
	);
}
