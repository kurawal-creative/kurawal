import { Button } from "@/components/ui/button";

interface PostsPaginationProps {
	currentPage: number;
	totalPages: number;
	onPreviousClick: () => void;
	onNextClick: () => void;
}

export default function PostsPagination({ currentPage, totalPages, onPreviousClick, onNextClick }: PostsPaginationProps) {
	if (totalPages <= 1) return null;

	return (
		<div className="mt-4 flex justify-center gap-2">
			<Button variant="outline" disabled={currentPage === 1} onClick={onPreviousClick}>
				Previous
			</Button>
			<div className="flex items-center gap-2">
				<span className="text-sm">
					Page {currentPage} of {totalPages}
				</span>
			</div>
			<Button variant="outline" disabled={currentPage === totalPages} onClick={onNextClick}>
				Next
			</Button>
		</div>
	);
}
