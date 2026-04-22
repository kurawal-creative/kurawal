import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2 } from "lucide-react";
import { Label } from "../ui/label";

interface Post {
	id: string;
	title: string;
	thumbnail?: string;
	description?: string;
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	type_post: "POST" | "PROJECT";
	createdAt: string;
	tagIds?: string[];
}

interface PostsTableProps {
	posts: Post[];
	loading: boolean;
	onDeleteClick: (postId: string) => void;
}

const getStatusColor = (status: string) => {
	switch (status) {
		case "PUBLISHED":
			return "bg-green-100 text-green-800";
		case "DRAFT":
			return "bg-yellow-100 text-yellow-800";
		case "ARCHIVED":
			return "bg-gray-100 text-gray-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export default function PostsTable({ posts, loading, onDeleteClick }: PostsTableProps) {
	const navigate = useNavigate();

	if (loading) {
		return (
			<div className="space-y-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
			</div>
		);
	}

	return (
		<div className="overflow-x-auto rounded-md border p-2">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Thumbnail</TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{posts.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
								No posts found
							</TableCell>
						</TableRow>
					) : (
						posts.map((post) => (
							<TableRow key={post.id}>
								<TableCell>
									<div className="h-12 w-20 overflow-hidden rounded-md border">
										<img src={post.thumbnail || "https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=600&auto=format&fit=crop"} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
									</div>
								</TableCell>
								<TableCell className="font-medium">{post.title}</TableCell>
								<TableCell>
									<span className={`rounded px-2 py-1 text-sm ${getStatusColor(post.status)}`}>{post.status}</span>
								</TableCell>
								<TableCell className="text-sm">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<Button size="sm" variant="outline" onClick={() => navigate(`/admin/posts/${post.id}/edit`)}>
											<Pencil className="h-4 w-4" />
										</Button>
										<Button size="sm" variant="destructive" onClick={() => onDeleteClick(post.id)}>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
			<Label className="px-2 py-4">
				Showing {posts.length} of {posts.length} posts
			</Label>
		</div>
	);
}
