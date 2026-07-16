import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { generateTagColor } from "@/utils/tagColors";
import { Tag } from "@/pages/dashboard/tags/index";

interface TagsTableProps {
	tags: Tag[];
	onEdit: (tag: Tag) => void;
	onDelete: (id: string) => void;
}

export function TagsTable({ tags, onEdit, onDelete }: TagsTableProps) {
	return (
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
							<Badge className={generateTagColor(tag.name)}>{tag.name}</Badge>
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
									<DropdownMenuItem onClick={() => onEdit(tag)}>
										<Pencil className="mr-2 h-4 w-4" />
										Edit
									</DropdownMenuItem>

									<DropdownMenuSeparator />

									<DropdownMenuItem variant="destructive" onClick={() => onDelete(tag.id)}>
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
	);
}
