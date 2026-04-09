import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { postsApi, tagsApi } from "@/utils/adminApi";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
	totalPosts: number;
	totalTags: number;
	publishedPosts: number;
	draftPosts: number;
}

export default function AdminDashboard() {
	const [stats, setStats] = useState<DashboardStats>({
		totalPosts: 0,
		totalTags: 0,
		publishedPosts: 0,
		draftPosts: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				const [postsData, tagsData] = await Promise.all([postsApi.getAll(1, 100), tagsApi.getAll(1, 100)]);

				const posts = postsData.data || [];

				const publishedCount = posts.filter((p: any) => p.status === "PUBLISHED").length;
				const draftCount = posts.filter((p: any) => p.status === "DRAFT").length;

				setStats({
					totalPosts: postsData.pagination?.totalItems || 0,
					totalTags: tagsData.pagination?.totalItems || 0,
					publishedPosts: publishedCount,
					draftPosts: draftCount,
				});
			} catch (error) {
				console.error("Error fetching stats:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	return (
		<AdminLayout>
			<div className="space-y-6 pb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground mt-2">Welcome to Kurawal Admin Dashboard</p>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Posts</CardTitle>
						</CardHeader>
						<CardContent>{loading ? <Skeleton className="h-7 w-16" /> : <div className="text-2xl font-bold">{stats.totalPosts}</div>}</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Published</CardTitle>
						</CardHeader>
						<CardContent>{loading ? <Skeleton className="h-7 w-16" /> : <div className="text-2xl font-bold text-green-600">{stats.publishedPosts}</div>}</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Drafts</CardTitle>
						</CardHeader>
						<CardContent>{loading ? <Skeleton className="h-7 w-16" /> : <div className="text-2xl font-bold text-yellow-600">{stats.draftPosts}</div>}</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Tags</CardTitle>
						</CardHeader>
						<CardContent>{loading ? <Skeleton className="h-7 w-16" /> : <div className="text-2xl font-bold">{stats.totalTags}</div>}</CardContent>
					</Card>
				</div>

				{/* Stats Summary */}
				<Card>
					<CardHeader>
						<CardTitle>Content Summary</CardTitle>
						<CardDescription>Quick overview of your content</CardDescription>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="space-y-2">
								<Skeleton className="h-20 w-full" />
							</div>
						) : (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm">Published Posts</span>
									<span className="text-2xl font-bold text-green-600">{stats.publishedPosts}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm">Draft Posts</span>
									<span className="text-2xl font-bold text-yellow-600">{stats.draftPosts}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm">Total Tags</span>
									<span className="text-2xl font-bold">{stats.totalTags}</span>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</AdminLayout>
	);
}
