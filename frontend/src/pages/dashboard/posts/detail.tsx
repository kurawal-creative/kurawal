import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { postsApi } from "@/utils/adminApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Pencil } from "lucide-react";
import AdminLayout from "@/layouts/adminLayout";
import { DetailContent } from "@/components/dashboard/posts/detail/DetailContent";

interface Post {
	id: string;
	title: string;
	description?: string;
	content: string;
	thumbnail?: string;
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	createdAt: string;
	updatedAt: string;
}

export default function DetailPostDashboard() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPost = async () => {
			if (!id) return;

			try {
				setLoading(true);
				const response = await postsApi.getById(id);
				const postData = response.data || response;
				setPost(postData);
			} catch (error) {
				console.error("Error fetching post:", error);
				toast.error("Failed to load post");
			} finally {
				setLoading(false);
			}
		};

		fetchPost();
	}, [id]);

	if (loading) {
		return (
			<AdminLayout>
				<div className="bg-background min-h-screen">
					<div className="mx-auto max-w-4xl p-6">
						<Skeleton className="mb-6 h-8 w-32" />
						<Skeleton className="mb-8 h-96 w-full rounded-lg" />
						<Skeleton className="mb-4 h-12 w-3/4" />
						<Skeleton className="mb-2 h-4 w-full" />
						<Skeleton className="mb-2 h-4 w-full" />
						<Skeleton className="h-4 w-2/3" />
					</div>
				</div>
			</AdminLayout>
		);
	}

	if (!post) {
		return (
			<AdminLayout>
				<div className="bg-background flex min-h-screen items-center justify-center">
					<div className="space-y-4 text-center">
						<p className="text-muted-foreground">Post not found</p>
						<Button onClick={() => navigate("/dashboard/posts")}>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Posts
						</Button>
					</div>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">Post Details</h1>
						<p className="text-muted-foreground mt-1 text-sm">View detailed information about this post.</p>
					</div>

					<div className="flex gap-2">
						<Button asChild variant="outline" size="sm">
							<Link to="/dashboard/posts">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back
							</Link>
						</Button>

						<Button asChild size="sm">
							<Link to={`/dashboard/posts/edit/${post.id}`}>
								<Pencil className="mr-2 h-4 w-4" />
								Edit Post
							</Link>
						</Button>
					</div>
				</div>

				{/* CONTENT */}
				<DetailContent post={post} />
			</div>
		</AdminLayout>
	);
}
