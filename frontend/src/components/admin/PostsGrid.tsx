import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2 } from "lucide-react";

interface Post {
	id: string;
	title: string;
	thumbnail?: string;
	description?: string;
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	createdAt: string;
}

interface PostsGridProps {
	posts: Post[];
	loading: boolean;
	onDeleteClick: (postId: string) => void;
}

const getStatusColor = (status: Post["status"]) => {
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

const PostsGrid = ({ posts, loading, onDeleteClick }: PostsGridProps) => {
	const navigate = useNavigate();

	if (loading) {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{Array.from({ length: 6 }).map((_, index) => (
					<Skeleton key={index} className="h-72 w-full rounded-xl" />
				))}
			</div>
		);
	}

	if (posts.length === 0) {
		return <div className="text-muted-foreground rounded-md border py-12 text-center">No posts found</div>;
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{posts.map((post) => (
				<Card key={post.id} className="overflow-hidden pt-0">
					<CardContent className="px-0">
						<img src={post.thumbnail || "https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=900&auto=format&fit=crop"} alt={post.title} className="aspect-video w-full object-cover" loading="lazy" />
					</CardContent>
					<CardHeader className="space-y-2">
						<div className="flex items-center justify-between gap-2">
							<span className={`rounded px-2 py-1 text-xs ${getStatusColor(post.status)}`}>{post.status}</span>
							<span className="text-muted-foreground text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
						</div>
						<CardTitle className="line-clamp-2 text-base">{post.title}</CardTitle>
						<CardDescription className="line-clamp-2">{post.description?.trim() || "No description"}</CardDescription>
					</CardHeader>
					<CardFooter className="gap-2">
						<Button size="sm" variant="outline" onClick={() => navigate(`/admin/posts/${post.id}/edit`)}>
							<Pencil className="h-4 w-4" />
						</Button>
						<Button size="sm" variant="destructive" onClick={() => onDeleteClick(post.id)}>
							<Trash2 className="h-4 w-4" />
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	);
};

export default PostsGrid;
