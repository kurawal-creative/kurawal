"use client";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const recentActivities = [
	{
		id: "1045",
		title: "E-Commerce Platform",
		type: "Project",
		status: "Published",
		variant: "secondary" as const,
	},
	{
		id: "1044",
		title: "Getting Started with React",
		type: "Post",
		status: "Draft",
		variant: "outline" as const,
	},
	{
		id: "1043",
		title: "Best UI/UX Design 2025",
		type: "Award",
		status: "Active",
		variant: "secondary" as const,
	},
	{
		id: "1042",
		title: "Portfolio Redesign",
		type: "Project",
		status: "In Progress",
		variant: "default" as const,
	},
] as const;

export function DashboardUpdates() {
	return (
		<Card className="rounded-none bg-background shadow-none ring-0 lg:col-span-3">
			<CardHeader>
				<CardTitle>Recent Activities</CardTitle>
				<CardDescription>Latest updates across projects, posts, and awards.</CardDescription>
			</CardHeader>
			<CardContent className="px-0 pb-2">
				<Table className="border-t">
					<TableCaption className="sr-only">
						Recent activities with title, type, and status.
					</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="pl-6">Title</TableHead>
							<TableHead>ID</TableHead>
							<TableHead className="text-right">Type</TableHead>
							<TableHead className="pr-6 text-right">Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{recentActivities.map((activity) => (
							<TableRow className="h-14" key={activity.id}>
								<TableCell className="max-w-40 truncate pl-6 font-medium">
									{activity.title}
								</TableCell>
								<TableCell className="text-muted-foreground tabular-nums">
									#{activity.id}
								</TableCell>
								<TableCell className="text-right">
									{activity.type}
								</TableCell>
								<TableCell className="pr-6 text-right">
									<Badge variant={activity.variant}>{activity.status}</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
