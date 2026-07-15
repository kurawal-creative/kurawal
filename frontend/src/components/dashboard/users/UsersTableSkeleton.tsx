import { Skeleton } from "@/components/ui/skeleton";

export function UsersTableSkeleton() {
	return (
		<div className="space-y-3 p-6">
			{[...Array(5)].map((_, i) => (
				<div key={i} className="flex items-center gap-4">
					<Skeleton className="h-12 w-12 rounded-full" />
					<Skeleton className="h-4 flex-1" />
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-24" />
				</div>
			))}
		</div>
	);
}
