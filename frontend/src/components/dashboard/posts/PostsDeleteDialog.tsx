import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PostsDeleteDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isDeleting: boolean;
}

export default function PostsDeleteDialog({ isOpen, onOpenChange, onConfirm, isDeleting }: PostsDeleteDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Post</DialogTitle>
					<DialogDescription>Are you sure you want to delete this post? This action cannot be undone.</DialogDescription>
				</DialogHeader>
				<div className="mt-4 flex justify-end gap-2">
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
						{isDeleting ? "Deleting..." : "Delete"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
