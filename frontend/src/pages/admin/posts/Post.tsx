import { useEffect, useState } from "react";
import { postsApi, tagsApi } from "@/utils/adminApi";
import PostsHeader from "@/components/admin/PostsHeader";
import PostsFilters from "@/components/admin/PostsFilters";
import PostsTable from "@/components/admin/PostsTable";
import PostsDeleteDialog from "@/components/admin/PostsDeleteDialog";
import AdminLayout from "@/layouts/adminLayout";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Table } from "lucide-react";
import PostsGrid from "@/components/admin/PostsGrid";

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

interface Tag {
	id: string;
	name: string;
}

export default function AdminPostsPage() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTag, setSelectedTag] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [deletePostId, setDeletePostId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const fetchPosts = async (page: number) => {
		try {
			setLoading(true);
			const tagFilter = selectedTag === "all" ? "" : selectedTag;
			const data = await postsApi.getAll(page, 10, searchTerm, tagFilter);
			setPosts(data.data || []);
		} catch (error) {
			console.error("Error fetching posts:", error);
			toast.error("Failed to fetch posts");
		} finally {
			setLoading(false);
		}
	};

	const fetchTags = async () => {
		try {
			const data = await tagsApi.getAll(1, 100);
			setTags(data.data || []);
		} catch (error) {
			console.error("Error fetching tags:", error);
			toast.error("Failed to fetch tags");
		}
	};

	useEffect(() => {
		fetchTags();
		fetchPosts(currentPage);
	}, []);

	useEffect(() => {
		if (currentPage !== 1) {
			setCurrentPage(1);
		} else {
			fetchPosts(1);
		}
	}, [searchTerm, selectedTag]);

	useEffect(() => {
		fetchPosts(currentPage);
	}, [currentPage]);

	const handleDelete = async () => {
		if (!deletePostId) return;

		try {
			setIsDeleting(true);
			await postsApi.delete(deletePostId);
			toast.success("Post deleted successfully");
			setIsDeleteOpen(false);
			setDeletePostId(null);
			fetchPosts(currentPage);
		} catch (error: any) {
			console.error("Error deleting post:", error);
			toast.error(error.response?.data?.message || "Failed to delete post");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AdminLayout>
			<div className="space-y-6 pb-8">
				<PostsHeader />
				{/* Filters */}
				<PostsFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} selectedTag={selectedTag} onTagChange={setSelectedTag} tags={tags} />

				<Tabs defaultValue="tables" className="">
					<TabsList>
						<TabsTrigger value="tables">
							<Table />{" "}
						</TabsTrigger>
						<TabsTrigger value="grid">
							<LayoutGrid />
						</TabsTrigger>
					</TabsList>
					<TabsContent value="tables">
						{/* Table */}
						<PostsTable
							posts={posts}
							loading={loading}
							onDeleteClick={(postId) => {
								setDeletePostId(postId);
								setIsDeleteOpen(true);
							}}
						/>
					</TabsContent>
					<TabsContent value="grid">
						<PostsGrid
							posts={posts}
							loading={loading}
							onDeleteClick={(postId) => {
								setDeletePostId(postId);
								setIsDeleteOpen(true);
							}}
						/>
					</TabsContent>
				</Tabs>
				<PostsDeleteDialog isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} onConfirm={handleDelete} isDeleting={isDeleting} />
			</div>
		</AdminLayout>
	);
}
