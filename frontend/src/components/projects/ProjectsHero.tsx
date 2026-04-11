import { Badge } from "@/components/ui/badge";

const projectStats = [
	{ label: "All", count: 28 },
	{ label: "Education", count: 9 },
	{ label: "Business", count: 6 },
	{ label: "Landing Page", count: 7 },
	{ label: "Dashboard", count: 4 },
	{ label: "Nonprofit", count: 2 },
];

export default function ProjectsHero() {
	return (
		<section className="relative mx-auto min-h-[60vh] w-full max-w-350 border-dashed px-0.5 pb-12 min-[1400px]:border-x min-[1800px]:max-w-384">
			<div className="relative overflow-hidden px-6 py-20 sm:px-10 sm:py-24">
				<div className="pointer-events-none absolute -top-12 left-10 h-44 w-44 rounded-full border border-dashed opacity-30" />
				<div className="pointer-events-none absolute right-12 -bottom-16 h-56 w-56 rounded-full border border-dashed opacity-20" />

				<div className="relative z-10 mx-auto max-w-4xl text-center leading-tight">
					<h1 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl lg:text-5xl dark:text-neutral-100">Where Stories Become Experiences</h1>
					<p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">From education platforms to business products, every project is crafted to deliver clear value, memorable interactions, and measurable impact.</p>

					<div className="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-1 sm:gap-2">
						{projectStats.map((item) => (
							<Badge key={item.label} variant="outline" className="rounded-full border-dashed bg-white/80 px-3.5 py-1.5 text-xs font-medium text-neutral-700 backdrop-blur-sm dark:bg-neutral-950/70 dark:text-neutral-200">
								<span>{item.label}</span>
								<span className="ml-2 rounded-full border border-dashed px-1.5 py-0.5 text-[11px] leading-none text-neutral-500 dark:text-neutral-300">{item.count}</span>
							</Badge>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
