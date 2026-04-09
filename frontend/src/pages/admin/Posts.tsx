import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { postsApi, tagsApi } from "@/utils/adminApi";
import PostsHeader from "@/components/admin/PostsHeader";
import PostsFilters from "@/components/admin/PostsFilters";
import PostsTable from "@/components/admin/PostsTable";
import PostsPagination from "@/components/admin/PostsPagination";
import PostsDeleteDialog from "@/components/admin/PostsDeleteDialog";
import { toast } from "sonner";

interface Post {
	id: string;
	title: string;
	description?: string;
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	type_post: "POST" | "PROJECT";
	createdAt: string;
	tagId: string;
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
	const [totalPages, setTotalPages] = useState(1);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [deletePostId, setDeletePostId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const fetchPosts = async (page: number) => {
		try {
			setLoading(true);
			const tagFilter = selectedTag === "all" ? "" : selectedTag;
			const data = await postsApi.getAll(page, 10, searchTerm, tagFilter);
			setPosts(data.data || []);
			setTotalPages(data.pagination?.totalPages || 1);
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
	}, []);

	useEffect(() => {
		setCurrentPage(1);
		fetchPosts(1);
	}, [searchTerm, selectedTag]);

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

				{/* Table */}
				<Card>
					<CardHeader>
						<CardTitle>Posts</CardTitle>
						<CardDescription>
							Showing {posts.length} of {posts.length} posts
						</CardDescription>
					</CardHeader>
					<CardContent>
						<PostsTable
							posts={posts}
							loading={loading}
							onDeleteClick={(postId) => {
								setDeletePostId(postId);
								setIsDeleteOpen(true);
							}}
						/>

						<PostsPagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPreviousClick={() => {
								setCurrentPage(currentPage - 1);
								fetchPosts(currentPage - 1);
							}}
							onNextClick={() => {
								setCurrentPage(currentPage + 1);
								fetchPosts(currentPage + 1);
							}}
						/>
					</CardContent>
				</Card>
			</div>

			<PostsDeleteDialog isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} onConfirm={handleDelete} isDeleting={isDeleting} />
		</AdminLayout>
	);
}
