import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function MobileDevelopment() {
	const featureList = ["Cross-platform iOS and Android apps", "Smooth and intuitive mobile navigation", "Optimized app performance and battery usage", "Clean architecture for long-term scaling"];

	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-350 border-dashed px-6 py-12 min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
					<div className="border border-dashed border-neutral-300 bg-neutral-50/60 p-4 dark:border-neutral-700 dark:bg-neutral-900/40">
						<div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">Mobile App Preview</div>
					</div>

					<div className="space-y-4">
						<h2 className="text-2xl leading-tight font-bold text-neutral-800 sm:text-3xl md:text-4xl dark:text-neutral-100">Mobile Development</h2>
						<p className="max-w-xl text-sm leading-relaxed text-neutral-700 sm:text-base dark:text-neutral-400">Our mobile development services help you build high-performing applications that deliver seamless experiences across devices.</p>

						<ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
							{featureList.map((item) => (
								<li key={item} className="flex items-center gap-2">
									<span className="h-1.5 w-1.5 rounded-full bg-neutral-700 dark:bg-neutral-200" />
									<span>{item}</span>
								</li>
							))}
						</ul>

						<div className="flex flex-wrap items-center gap-3 pt-1">
							<Button asChild className="rounded-full">
								<Link to="/works">See Projects</Link>
							</Button>

							<Button asChild variant="outline" className="rounded-full border-dashed">
								<Link to="/services">View Process</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
