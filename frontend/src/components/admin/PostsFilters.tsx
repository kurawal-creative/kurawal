import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Tag {
	id: string;
	name: string;
}

interface PostsFiltersProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	selectedTag: string;
	onTagChange: (value: string) => void;
	tags: Tag[];
}

export default function PostsFilters({ searchTerm, onSearchChange, selectedTag, onTagChange, tags }: PostsFiltersProps) {
	return (
		<div className="flex gap-4">
			<Input placeholder="Search by title or description..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="flex-1" />
			<Select value={selectedTag} onValueChange={onTagChange}>
				<SelectTrigger className="w-48">
					<SelectValue placeholder="Filter by tag" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Tags</SelectItem>
					{tags.map((tag) => (
						<SelectItem key={tag.id} value={tag.id}>
							{tag.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
