import { BackgroundRippleEffect } from "../ui/background-ripple-effect";

export default function BlogsHero() {
	return (
		<section className="relative mx-auto min-h-[60vh] w-full max-w-350 border-dashed px-0.5 pb-12 min-[1400px]:border-x min-[1800px]:max-w-384">
			{/* Background Ripple */}
			<BackgroundRippleEffect />

			{/* Content */}
			<div className="relative overflow-hidden px-6 py-20 sm:px-10 sm:py-24">
				<div className="pointer-events-none absolute -top-12 left-10 h-44 w-44 rounded-full border border-dashed opacity-30" />
				<div className="pointer-events-none absolute right-12 -bottom-16 h-56 w-56 rounded-full border border-dashed opacity-20" />

				<div className="relative z-10 mx-auto max-w-4xl text-center leading-tight">
					<h1 className="mt-9.5 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl lg:text-5xl dark:text-neutral-100">Insights That Drive Innovation</h1>
					<p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">Explore ideas, trends, and perspectives shaping the future of design, technology, and digital experiences.</p>
				</div>
			</div>
		</section>
	);
}
