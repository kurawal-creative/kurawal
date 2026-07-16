import { ArrowUpRight } from "lucide-react";
import SafariMockups from "../../SafariMockup";
import { Button } from "../../ui/button";
import { Highlighter } from "../../ui/highlighter";
import IphoneMockup from "../../IphoneMockup";
import { Link } from "react-router-dom";

const ServicesSection = () => {
	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-350 border-dashed py-12 min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="flex flex-col items-center lg:flex-row lg:gap-12">
					{/* Left */}
					<div className="flex-1 items-center justify-start p-6 text-center lg:text-start">
						<p className="font-caveat text-xl text-neutral-800 dark:text-neutral-400">
							<Highlighter action="underline" color="" padding={2} strokeWidth={1} iterations={2}>
								Our Services
							</Highlighter>
						</p>

						<div className="mx-auto mt-5 flex flex-col items-center lg:items-start">
							<h2 className="max-w-4xl text-3xl leading-tight font-bold text-neutral-800 md:text-4xl lg:text-4xl dark:text-neutral-100">We Build Digital Experiences</h2>
							<p className="mx-auto mt-2 max-w-2xl text-neutral-700 dark:text-neutral-400">From concept to launch, we craft products with thoughtful design, robust development, and user-centric experiences helping brands grow with clarity and confidence.</p>
						</div>

						<div className="flex justify-center lg:justify-start">
							<Button asChild className="group mt-7 rounded-full">
								<Link to={"contact-us"} className="flex items-center gap-2">
									Contact Us <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>

					{/* Right */}
					<div className="flex-1/6">
						<div className="grid grid-cols-1 gap-0 border border-dashed md:grid-cols-5 lg:grid-cols-5">
							{/* Mobile App */}
							<div className="overflow-hidden border-b border-dashed p-4 md:col-span-2 lg:col-span-2 lg:border-r">
								<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Mobile App Development</h2>
								<p className="text-neutral-600 dark:text-neutral-400">High-performance mobile apps for iOS & Android.</p>

								<div className="mx-auto mt-4 flex items-center justify-center gap-2">

									<IphoneMockup />
								</div>
							</div>

							{/* Website */}
							<div className="overflow-hidden border-b border-dashed p-4 md:col-span-3 lg:col-span-3">
								<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Website Development</h2>
								<p className="text-neutral-600 dark:text-neutral-400">Fast, scalable, and conversion-focused websites.</p>
								<div className="mt-4 flex w-full justify-center lg:justify-start">
									<SafariMockups />
								</div>
							</div>

							{/* UI UX */}
							<div className="col-span-1 overflow-hidden border-b-0 border-dashed p-4 md:col-span-5 lg:col-span-5">
								<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">UI/UX Design</h2>
								<p className="text-neutral-600 dark:text-neutral-400">Clean, intuitive, and user-centered digital design.</p>
								
								<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
									<div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-neutral-800">
											<svg className="h-5 w-5 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
											</svg>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">User Research</p>
											<p className="text-xs text-neutral-600 dark:text-neutral-400">Understanding user needs</p>
										</div>
									</div>

									<div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-neutral-800">
											<svg className="h-5 w-5 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
											</svg>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Wireframing</p>
											<p className="text-xs text-neutral-600 dark:text-neutral-400">Structure & layout planning</p>
										</div>
									</div>

									<div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-neutral-800">
											<svg className="h-5 w-5 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
											</svg>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Visual Design</p>
											<p className="text-xs text-neutral-600 dark:text-neutral-400">Beautiful & functional UI</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default ServicesSection;
