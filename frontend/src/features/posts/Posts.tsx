import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";

interface Post {
	_id: string;
	title: string;
	content: string;
	authorId: string;
	createdAt: string | Date; // MongoDB bisa kirim Date atau string
	__v?: number; // Version field dari Mongoose (opsional)
}

export default function Posts() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			const response = await api.get("/posts");
			setPosts(response.data);
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to fetch posts");
		} finally {
			setLoading(false);
		}
	};

	const deletePost = async (id: string) => {
		if (!confirm("Are you sure?")) return;
		try {
			await api.delete(`/posts/${id}`);
			setPosts(posts.filter((p) => p._id !== id));
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to delete post");
		}
	};

	if (loading) {
		return null;
	}

	if (error) {
		return (
			<div className="container mx-auto p-6">
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<AdminLayout>
			<div className="">
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-3xl font-bold">Posts</h1>
					<Button asChild>
						<Link to="/create-post">
							<Plus className="mr-2 h-4 w-4" />
							Create New Post
						</Link>
					</Button>
				</div>

				{posts.length === 0 ? (
					<div className="py-12 text-center">
						<p className="text-muted-foreground">No posts found. Create your first post!</p>
					</div>
				) : (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{posts.map((post) => (
							<Card key={post._id} className="transition-shadow hover:shadow-lg">
								<CardHeader>
									<div className="flex items-start justify-between">
										<CardTitle className="line-clamp-2 text-xl">{post.title}</CardTitle>
										<Badge variant="secondary" className="ml-2 shrink-0">
											{new Date(post.createdAt).toLocaleDateString()}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
									<div className="flex gap-2">
										<Button asChild variant="outline" size="sm">
											<Link to={`/edit-post/${post._id}`}>
												<Edit className="mr-2 h-4 w-4" />
												Edit
											</Link>
										</Button>
										<Button variant="destructive" size="sm" onClick={() => deletePost(post._id)}>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</AdminLayout>
	);
}
