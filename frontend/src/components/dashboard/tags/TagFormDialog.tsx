import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag } from "@/pages/dashboard/tags/index";

interface TagFormDialogProps {
	isOpen: boolean;
	onClose: () => void;
	editingTag: Tag | null;
	formData: {
		name: string;
		slug: string;
		color: string;
	};
	setFormData: (data: { name: string; slug: string; color: string }) => void;
	onSubmit: () => void;
	generateSlug: (text: string) => string;
}

export function TagFormDialog({ isOpen, onClose, editingTag, formData, setFormData, onSubmit, generateSlug }: TagFormDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
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
									...formData,
									name,
									slug: !editingTag || formData.slug === generateSlug(formData.name) ? generateSlug(name) : formData.slug,
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
						<Button variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button onClick={onSubmit}>{editingTag ? "Update Tag" : "Create Tag"}</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
