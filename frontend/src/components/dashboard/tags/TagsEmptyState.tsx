import { Tag as TagIcon } from "lucide-react";

export function TagsEmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-10">
			<div className="bg-muted/50 mb-3 flex h-14 w-14 items-center justify-center rounded-full">
				<TagIcon className="text-muted-foreground h-7 w-7" />
			</div>
			<p className="text-sm font-medium">No tags found</p>
			<p className="text-muted-foreground mt-1 text-xs">Try changing the search term or create a new tag.</p>
		</div>
	);
}
