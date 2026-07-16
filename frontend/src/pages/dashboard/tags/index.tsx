import AdminLayout from "@/layouts/adminLayout";
import { useCallback, useEffect, useState } from "react";
import { tagsApi } from "@/utils/adminApi";
import { toast } from "sonner";
import { TagsListDashboard } from "@/components/dashboard/tags/TagsListDashboard";

export interface Tag {
	id: string;
	name: string;
	slug: string;
	color?: string;
	createdAt: string;
}

export default function AdminTagsPage() {
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const fetchTags = useCallback(
		async (page: number) => {
			try {
				setLoading(true);
				const data = await tagsApi.getAll(page, 10, searchTerm);
				setTags(data.data || []);
				setTotalPages(data.pagination?.totalPages || 1);
			} catch (error) {
				console.error("Error fetching tags:", error);
				toast.error("Failed to fetch tags");
			} finally {
				setLoading(false);
			}
		},
		[searchTerm],
	);

	useEffect(() => {
		setCurrentPage(1);
		fetchTags(1);
	}, [fetchTags]);

	return (
		<AdminLayout>
			<TagsListDashboard tags={tags} loading={loading} searchTerm={searchTerm} setSearchTerm={setSearchTerm} currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => {
					setCurrentPage(page);
					fetchTags(page);
				}} onTagChange={() => fetchTags(currentPage)} />
		</AdminLayout>
	);
}
