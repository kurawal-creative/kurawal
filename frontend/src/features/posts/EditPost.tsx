import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditPost() {
	const { id } = useParams<{ id: string }>();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		fetchPost();
	}, [id]);

	const fetchPost = async () => {
		try {
			const response = await api.get(`/posts/${id}`);
			setTitle(response.data.title);
			setContent(response.data.content);
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to fetch post");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await api.put(`/posts/${id}`, { title, content });
			navigate("/posts");
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to update post");
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (error && !title) {
		return (
			<div className="container mx-auto p-6">
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-2xl p-6">
			<div className="mb-6">
				<Button variant="ghost" asChild className="mb-4">
					<Link to="/posts">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Posts
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Edit Post</CardTitle>
					<CardDescription>Update your post content</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter post title" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="content">Content</Label>
							<Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Write your post content here..." rows={6} />
						</div>
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<Button type="submit" className="w-full">
							Update Post
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
