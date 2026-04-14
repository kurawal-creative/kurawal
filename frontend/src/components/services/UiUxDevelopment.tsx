import { Link } from "react-router-dom";

export default function UiUxDevelopment() {
	const featureList = ["User research and journey mapping", "Wireframing and interactive prototyping", "Design systems for consistency", "Accessibility-first interface strategy"];

	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-350 border-dashed px-6 py-12 min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
					<div className="space-y-4">
						<h2 className="text-2xl leading-tight font-bold text-neutral-800 sm:text-3xl md:text-4xl dark:text-neutral-100">UI/UX Development</h2>
						<p className="max-w-xl text-sm leading-relaxed text-neutral-700 sm:text-base dark:text-neutral-400">Our UI/UX development services help you craft intuitive digital experiences that balance visual quality with measurable usability.</p>

						<ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
							{featureList.map((item) => (
								<li key={item} className="flex items-center gap-2">
									<span className="h-1.5 w-1.5 rounded-full bg-neutral-700 dark:bg-neutral-200" />
									<span>{item}</span>
								</li>
							))}
						</ul>

						<div className="flex flex-wrap items-center gap-3 pt-1">
							<Link to="/works" className="inline-flex items-center rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-700 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-300">
								See Projects
							</Link>
							<Link to="/services" className="inline-flex items-center rounded-full border border-dashed border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-100 dark:hover:text-neutral-100">
								View Process
							</Link>
						</div>
					</div>

					<div className="border border-dashed border-neutral-300 bg-neutral-50/60 p-4 dark:border-neutral-700 dark:bg-neutral-900/40">
						<div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">UI/UX Design Preview</div>
					</div>
				</div>
			</section>
		</>
	);
}
