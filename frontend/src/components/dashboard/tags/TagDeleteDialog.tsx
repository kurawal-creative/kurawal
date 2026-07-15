import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TagDeleteDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function TagDeleteDialog({ isOpen, onClose, onConfirm }: TagDeleteDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Tag</DialogTitle>
					<DialogDescription>Are you sure you want to delete this tag? This action cannot be undone.</DialogDescription>
				</DialogHeader>
				<div className="mt-4 flex justify-end gap-2">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Delete
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
