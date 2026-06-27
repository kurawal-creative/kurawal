import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Delta, DeltaIcon, DeltaValue } from "@/components/Delta";
import { postsApi } from "@/utils/adminApi";
import api from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, FolderKanban, Award } from "lucide-react";

type Stat = {
	label: string;
	value: string;
	delta: number;
	icon: React.ReactNode;
	color: string;
};

export function DashboardStats() {
	const [stats, setStats] = useState<Stat[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				const [postsData, worksData] = await Promise.all([postsApi.getAll(1, 100), api.get("/works").catch(() => ({ data: [] }))]);

				const posts = postsData.data || [];
				const publishedCount = posts.filter((p: { status: string }) => p.status === "PUBLISHED").length;

				setStats([
					{
						label: "Total Projects",
						value: String(worksData.data?.length || 0),
						delta: 8.3,
						icon: <FolderKanban className="h-4 w-4" />,
						color: "text-blue-600",
					},
					{
						label: "Published Posts",
						value: String(publishedCount),
						delta: 15.7,
						icon: <FileText className="h-4 w-4" />,
						color: "text-emerald-600",
					},
					{
						label: "Awards Received",
						value: "12",
						delta: 4.2,
						icon: <Award className="h-4 w-4" />,
						color: "text-amber-600",
					},
				]);
			} catch (error) {
				console.error("Error fetching stats:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (loading) {
		return (
			<>
				{[1, 2, 3].map((i) => (
					<Card key={i} className="bg-background rounded-none border-0 shadow-none ring-0">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-8 w-16" />
						</CardHeader>
						<CardContent className="flex flex-row items-center gap-2">
							<Skeleton className="h-8 w-16" />
						</CardContent>
					</Card>
				))}
			</>
		);
	}

	return (
		<>
			{stats.map((s) => (
				<StatCard key={s.label} stat={s} />
			))}
		</>
	);
}

function StatCard({ stat, className }: { stat: Stat; className?: string }) {
	const { label, value, delta, icon } = stat;

	return (
		<div className={cn("group relative overflow-hidden bg-background border-r last:border-r-0 transition-colors duration-200 hover:bg-muted/30", className)}>
			{/* Gradient accent */}
			<div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-muted/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

			<div className="relative flex h-full flex-col justify-between p-5">
				{/* Top section */}
				<div className="flex items-start justify-between mb-3">
					<div className="transition-transform duration-300 group-hover:scale-110 text-muted-foreground h-6 w-6">
						{icon}
					</div>

					<Delta value={delta}>
						<div className="flex items-center gap-1 text-xs font-medium">
							<DeltaIcon className="h-3.5 w-3.5" />
							<DeltaValue />
						</div>
					</Delta>
				</div>

				{/* Bottom section */}
				<div>
					<div className="text-3xl font-bold tracking-tight tabular-nums transition-colors">{value}</div>

					<div className="mt-2.5 text-xs font-medium text-muted-foreground tracking-wide uppercase">
						{label}
					</div>
				</div>
			</div>

			{/* Hover indicator */}
			<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-border to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
		</div>
	);
}
