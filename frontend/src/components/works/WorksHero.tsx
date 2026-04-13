import { Badge } from "@/components/ui/badge";
import { BackgroundRippleEffect } from "../ui/background-ripple-effect";
type WorksStat = {
	label: string;
	count: number;
};

type WorksHeroProps = {
	worksStats: WorksStat[];
	activeFilter: string;
	onFilterChange: (label: string) => void;
};

export default function WorksHero({ worksStats, activeFilter, onFilterChange }: WorksHeroProps) {
	return (
		<section className="relative mx-auto min-h-[60vh] w-full max-w-350 border-dashed px-0.5 pb-12 min-[1400px]:border-x min-[1800px]:max-w-384">
			{/* Background Ripple */}
			<BackgroundRippleEffect />

			{/* Content */}
			<div className="relative overflow-hidden px-6 py-20 sm:px-10 sm:py-24">
				<div className="pointer-events-none absolute -top-12 left-10 h-44 w-44 rounded-full border border-dashed opacity-30" />
				<div className="pointer-events-none absolute right-12 -bottom-16 h-56 w-56 rounded-full border border-dashed opacity-20" />

				<div className="relative z-10 mx-auto max-w-4xl text-center leading-tight">
					<h1 className="mt-9.5 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl lg:text-5xl dark:text-neutral-100">Where Stories Become Experiences</h1>
					<p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">From education platforms to business products, every project is crafted to deliver clear value, memorable interactions, and measurable impact.</p>

					<div className="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-1 sm:gap-2">
						{worksStats.map((item) => (
							<Badge
								key={item.label}
								variant="outline"
								onClick={() => onFilterChange(item.label)}
								className={`group rounded-full px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm transition-all ${
									activeFilter === item.label
										? "cursor-default border border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950"
										: "cursor-pointer border border-dashed border-neutral-300 bg-white/80 text-neutral-700 hover:border-solid hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:bg-neutral-950/70 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-950"
								}`}
							>
								<span>{item.label}</span>

								<span className={`ml-2 rounded-full border border-dashed px-1.5 py-0.5 text-[11px] leading-none transition-colors ${activeFilter === item.label ? "text-white/85 dark:text-neutral-800" : "text-neutral-500 group-hover:text-white dark:text-neutral-300 dark:group-hover:text-neutral-950"}`}>{item.count}</span>
							</Badge>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
