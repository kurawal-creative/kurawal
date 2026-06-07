export default function WorksCardSkeleton() {
	return (
		<div className="overflow-hidden border-b border-dashed p-0.5">
			<div className="relative isolate min-h-72 overflow-hidden bg-neutral-300 dark:bg-neutral-800">
				<div className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-700" />

				<div className="absolute top-4 left-4 z-10 h-6 w-24 animate-pulse rounded-md bg-neutral-300 dark:bg-neutral-600" />
				<div className="absolute top-4 right-4 z-10 h-6 w-20 animate-pulse rounded-md bg-neutral-300 dark:bg-neutral-600" />

				<div className="absolute inset-x-0 bottom-0 z-10 space-y-2 p-5">
					<div className="h-4 w-3/4 animate-pulse rounded bg-neutral-300 dark:bg-neutral-600" />
					<div className="h-4 w-full animate-pulse rounded bg-neutral-300 dark:bg-neutral-600" />
				</div>
			</div>
		</div>
	);
}
