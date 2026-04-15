import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Loader2, Plus, Edit, Trash2, EllipsisVertical, Archive, Pencil, Search, Grid2X2, TableProperties } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { P } from "node_modules/framer-motion/dist/types.d-BJcRxCew";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Post {
	_id: string;
	title: string;
	description: string;
	type_post: string;
	content: string;
	link_github: string;
	tech_stack: string[];
	authorId: string;
	tags: Tag[];
	createdAt: string | Date;
	updatedAt: string | Date;
	__v: number;
}

interface Tag {
	_id: string;
	tag_name: string;
}

export default function Posts() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [postToDelete, setPostToDelete] = useState<string | null>(null);

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			const response = await api.get("/posts");
			setPosts(response.data.data || []);
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to fetch posts");
		} finally {
			setLoading(false);
		}
	};

	const deletePost = async (id: string) => {
		try {
			await api.delete(`/posts/${id}`);
			setPosts(posts.filter((p) => p._id !== id));
			setDeleteDialogOpen(false);
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to delete post");
		}
	};

	const handleDeleteClick = (id: string) => {
		setPostToDelete(id);
		setDeleteDialogOpen(true);
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
			<div className="my-6 flex justify-between">
				<InputGroup className="w-md">
					<InputGroupInput placeholder="Search..." />
					<InputGroupAddon>
						<Search />
					</InputGroupAddon>
				</InputGroup>
				<ButtonGroup className="">
					<Button variant="outline" size="icon">
						<TableProperties className="size-4 stroke-2 text-gray-500" />
					</Button>
					<ButtonGroupSeparator />
					<Button variant="outline" size="icon">
						<Grid2X2 className="size-4 stroke-2 text-gray-500" />
					</Button>
				</ButtonGroup>
			</div>

			{posts.length === 0 ? (
				<div className="py-12 text-center">
					<p className="text-muted-foreground">No posts found. Create your first post!</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{posts.map((post) => (
						<div key={post._id}>
							<div className="bg-primary h-32 w-full rounded-t-lg border"></div>
							<div className="flex flex-col gap-2 rounded-b-lg border bg-white p-6">
								<div className="flex justify-between">
									<h1 className="text-md font-semibold">{post.title}</h1>
									<DropdownMenu>
										<DropdownMenuTrigger>
											<EllipsisVertical className="size-4" />
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuLabel className="text-sm">Aksi</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem className="text-xs text-amber-600 hover:text-amber-600!">
												<Pencil className="inline size-4 text-amber-600" /> Edit
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => handleDeleteClick(post._id)} className="text-xs text-red-600 hover:text-red-600!">
												<Trash2 className="inline size-4 text-red-600" /> Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
								<h4 className="text-xs">{new Date(post.createdAt).toLocaleDateString("id-ID", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</h4>
								<p className="line-clamp-3 text-sm text-gray-500">
									{/* {post.description} */}
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus eum alias ducimus neque, facilis repellendus corrupti accusantium suscipit temporibus! Animi, voluptates quam saepe cum quasi illo dolores esse! Esse, iste tenetur error nesciunt dolore minima, quae maxime deserunt corporis excepturi aliquid id dolor repellat perspiciatis quidem recusandae iusto reiciendis quo.
								</p>
								{post.tags && post.tags.length > 0 ? (
									<div className="mt-3 flex flex-wrap gap-2">
										{post.tags.map((tag) => (
											<p className="w-fit rounded-sm border border-blue-400 bg-blue-50 px-2 py-1 text-xs text-blue-600">{tag.tag_name}</p>
										))}
									</div>
								) : (
									<p>Tidak ada tag</p>
								)}
							</div>
						</div>
					))}
				</div>
			)}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Apakah anda yakin menghapus post ini?</AlertDialogTitle>
						<AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Postingan ini akan dihapus secara permanen dan dihapus dari server.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction onClick={() => postToDelete && deletePost(postToDelete)} className="bg-red-600 hover:bg-red-800">
							Hapus
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
