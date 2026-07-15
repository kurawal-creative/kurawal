import { Button } from "@/components/ui/button";

interface TagsPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function TagsPagination({ currentPage, totalPages, onPageChange }: TagsPaginationProps) {
	return (
		<div className="flex items-center justify-end gap-2 border-t p-4">
			<Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
				Previous
			</Button>
			<div className="flex items-center gap-2">
				<span className="text-muted-foreground text-sm">
					Page {currentPage} of {totalPages}
				</span>
			</div>
			<Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
				Next
			</Button>
		</div>
	);
}
