export default function BlogCardSkeleton() {
	return (
		<div className="flex flex-col border border-dashed">
			<div className="relative w-full overflow-hidden">
				<div className="h-56 w-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
				<div className="absolute top-4 left-4 h-6 w-20 animate-pulse rounded-md bg-neutral-300 dark:bg-neutral-600" />
			</div>
			<div className="space-y-1.5 p-4">
				<div className="h-3 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
				<div className="h-5 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
				<div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
			</div>
			<div className="w-full px-4 pb-4">
				<div className="inline-flex h-7 w-24 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
			</div>
		</div>
	);
}
