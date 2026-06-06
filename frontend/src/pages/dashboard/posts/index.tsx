import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postsApi } from "@/utils/adminApi";
import PostsDeleteDialog from "@/components/dashboard/posts/PostsDeleteDialog";
import AdminLayout from "@/layouts/adminLayout";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2, FileText, Archive, CheckCircle2, Clock } from "lucide-react";

interface Post {
	id: string;
	title: string;
	thumbnail?: string;
	description?: string;
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	createdAt: string;
	tagIds?: string[];
}

export default function AdminPostsPage() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [deletePostId, setDeletePostId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const fetchPosts = useCallback(
		async (page: number) => {
			try {
				setLoading(true);

				const data = await postsApi.getAll(page, 10, searchTerm, "");

				setPosts(data.data || []);
			} catch (error) {
				console.error("Error fetching posts:", error);
				toast.error("Failed to fetch posts");
			} finally {
				setLoading(false);
			}
		},
		[searchTerm],
	);

	useEffect(() => {
		fetchPosts(currentPage);
	}, [fetchPosts, currentPage]);

	useEffect(() => {
		if (currentPage !== 1) {
			setCurrentPage(1);
		} else {
			fetchPosts(1);
		}
	}, [searchTerm, currentPage, fetchPosts]);

	const handleDelete = async () => {
		if (!deletePostId) return;

		try {
			setIsDeleting(true);
			await postsApi.delete(deletePostId);
			toast.success("Post deleted successfully");
			setIsDeleteOpen(false);
			setDeletePostId(null);
			fetchPosts(currentPage);
		} catch (error: unknown) {
			console.error("Error deleting post:", error);
			const errorMessage = error && typeof error === "object" && "response" in error ? (error.response as { data?: { message?: string } })?.data?.message : undefined;
			toast.error(errorMessage || "Failed to delete post");
		} finally {
			setIsDeleting(false);
		}
	};

	const getStatusVariant = (status: string) => {
		switch (status) {
			case "PUBLISHED":
				return {
					variant: "secondary" as const,
					className: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-500",
				};
			case "DRAFT":
				return {
					variant: "secondary" as const,
					className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:bg-amber-500/10 dark:text-amber-500",
				};
			case "ARCHIVED":
				return {
					variant: "outline" as const,
					className: "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400",
				};
			default:
				return {
					variant: "outline" as const,
					className: "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400",
				};
		}
	};

	const filteredPosts = posts.filter((p) => {
		const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description?.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
		return matchesSearch && matchesStatus;
	});

	const getStatusCounts = () => {
		const published = posts.filter((p) => p.status === "PUBLISHED").length;
		const draft = posts.filter((p) => p.status === "DRAFT").length;
		const archived = posts.filter((p) => p.status === "ARCHIVED").length;
		return { all: posts.length, published, draft, archived };
	};

	const counts = getStatusCounts();

	return (
		<AdminLayout>
			<div className="space-y-5">
				{/* Header */}
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">Posts Management</h1>
						<p className="text-muted-foreground mt-1 text-sm">Manage and organize all your blog posts and articles.</p>
					</div>

					<Button asChild>
						<Link to="/dashboard/posts/create">
							<Plus className="mr-2 h-4 w-4" />
							New Post
						</Link>
					</Button>
				</div>

				{/* Stats */}
				<div className="grid gap-3 md:grid-cols-4">
					<div className="bg-card flex items-center justify-between rounded-xl border p-4">
						<div>
							<p className="text-muted-foreground text-xs font-medium">Total Posts</p>
							<p className="mt-1 text-2xl font-bold">{counts.all}</p>
						</div>

						<div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-lg">
							<FileText className="text-primary h-5 w-5" />
						</div>
					</div>

					<div className="bg-card flex items-center justify-between rounded-xl border p-4">
						<div>
							<p className="text-muted-foreground text-xs font-medium">Published</p>
							<p className="mt-1 text-2xl font-bold">{counts.published}</p>
						</div>

						<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
							<CheckCircle2 className="h-5 w-5 text-emerald-600" />
						</div>
					</div>

					<div className="bg-card flex items-center justify-between rounded-xl border p-4">
						<div>
							<p className="text-muted-foreground text-xs font-medium">Draft</p>
							<p className="mt-1 text-2xl font-bold">{counts.draft}</p>
						</div>

						<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/10">
							<Clock className="h-5 w-5 text-amber-600" />
						</div>
					</div>

					<div className="bg-card flex items-center justify-between rounded-xl border p-4">
						<div>
							<p className="text-muted-foreground text-xs font-medium">Archived</p>
							<p className="mt-1 text-2xl font-bold">{counts.archived}</p>
						</div>

						<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-500/10">
							<Archive className="h-5 w-5 text-slate-600" />
						</div>
					</div>
				</div>

				<div className="bg-card rounded-xl border">
					{/* Toolbar */}
					<div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
						<Tabs defaultValue="all" onValueChange={setStatusFilter}>
							<TabsList className="h-9">
								<TabsTrigger value="all">All ({counts.all})</TabsTrigger>
								<TabsTrigger value="published">Published ({counts.published})</TabsTrigger>
								<TabsTrigger value="draft">Draft ({counts.draft})</TabsTrigger>
								<TabsTrigger value="archived">Archived ({counts.archived})</TabsTrigger>
							</TabsList>
						</Tabs>

						<div className="flex gap-2">
							<div className="relative w-full lg:w-72">
								<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
								<Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search posts..." className="h-9 pl-9" />
							</div>

							<Button variant="outline" size="icon" className="h-9 w-10">
								<Filter className="h-4 w-4" />
							</Button>

							<Button variant="outline" size="icon" className="h-9 w-10">
								<ArrowUpDown className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Table */}
					{loading ? (
						<div className="space-y-3 p-6">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="flex items-center gap-4">
									<Skeleton className="h-12 w-12 rounded" />
									<Skeleton className="h-4 flex-1" />
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-4 w-24" />
								</div>
							))}
						</div>
					) : filteredPosts.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-10">
							<div className="bg-muted/50 mb-3 flex h-14 w-14 items-center justify-center rounded-full">
								<FileText className="text-muted-foreground h-7 w-7" />
							</div>

							<p className="text-sm font-medium">{statusFilter === "all" ? "No posts found" : statusFilter === "published" ? "No published posts" : statusFilter === "draft" ? "No draft posts" : "No archived posts"}</p>

							<p className="text-muted-foreground mt-1 text-xs">Try changing the filter or create a new post.</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/30 hover:bg-muted/30">
									<TableHead className="w-14">No.</TableHead>
									<TableHead>Post</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="w-14">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{filteredPosts.map((p, index) => (
									<TableRow key={p.id} className="group">
										<TableCell className="text-muted-foreground">{index + 1}</TableCell>

										<TableCell>
											<div className="flex items-center gap-3">
												<div className="bg-muted h-11 w-11 overflow-hidden rounded-lg border">{p.thumbnail ? <img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover" /> : null}</div>

												<div>
													<p className="font-medium">{p.title}</p>
													<p className="text-muted-foreground line-clamp-1 text-xs">{p.description || "No description"}</p>
												</div>
											</div>
										</TableCell>

										<TableCell className="text-muted-foreground">
											{new Date(p.createdAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</TableCell>

										<TableCell>
											<Badge className={getStatusVariant(p.status).className}>{p.status}</Badge>
										</TableCell>

										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>

												<DropdownMenuContent align="end">
													<DropdownMenuItem asChild>
														<Link to={`/dashboard/posts/detail/${p.id}`}>
															<Eye className="mr-2 h-4 w-4" />
															View
														</Link>
													</DropdownMenuItem>

													<DropdownMenuItem asChild>
														<Link to={`/dashboard/posts/edit/${p.id}`}>
															<Pencil className="mr-2 h-4 w-4" />
															Edit
														</Link>
													</DropdownMenuItem>

													<DropdownMenuSeparator />

													<DropdownMenuItem
														variant="destructive"
														onClick={() => {
															setDeletePostId(p.id);
															setIsDeleteOpen(true);
														}}
													>
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
					)}
				</div>

				<PostsDeleteDialog isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} onConfirm={handleDelete} isDeleting={isDeleting} />
			</div>
		</AdminLayout>
	);
}
