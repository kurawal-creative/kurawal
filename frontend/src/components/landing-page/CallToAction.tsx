import { ArrowUpRight, Globe } from "lucide-react";
import CardSwap, { Card } from "../CardSwap";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

import arunika from "@/assets/images/arunika.jpg";
import aitherway from "@/assets/images/aitherway.jpg";
import daunesia from "@/assets/images/daunesia.jpg";
import cetha from "@/assets/images/cetha.jpg";
import kurawal from "@/assets/svg/kurawal.svg";

const movingCards = [
	{
		id: 1,
		icons: Globe,
		title: "arunika.kurawal.site",
		img: arunika,
	},
	{
		id: 2,
		icons: Globe,
		title: "aither-way.vercel.app",
		img: aitherway,
	},
	{
		id: 3,
		icons: Globe,
		title: "daunesia.kurawal.site",
		img: daunesia,
	},
	{
		id: 4,
		icons: Globe,
		title: "cetha.vercel.app",
		img: cetha,
	},
];

const CallToAction = () => {
	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-[1400px] border-dashed py-12 min-[1400px]:border-x min-[1800px]:max-w-[1536px]">
				<div className="px-2 lg:px-14">
					<div className="overflow-hidden rounded-3xl border">
						<div className="relative overflow-hidden md:h-60 lg:h-90">
							<div className="flex flex-col items-center md:items-start md:gap-0 lg:flex-row lg:gap-6">
								{/* LEFT CONTENT */}
								<div className="relative lg:w-2/3">
									<div className="absolute top-39 -left-8 md:-right-3 md:left-auto lg:top-69 lg:-left-3">
										<img src={kurawal} alt="kurawal" className="h-40 w-40 -rotate-35 opacity-40 md:h-50 md:w-50 md:scale-x-[-1] md:rotate-35 lg:scale-x-[1] lg:-rotate-35" />
									</div>

									<div className="relative p-8 lg:translate-y-1/2 lg:p-0 lg:px-8">
										<div className="text-center md:text-start">
											<h2 className="max-w-4xl text-xl leading-tight font-bold text-neutral-800 sm:text-2xl md:text-3xl lg:text-4xl dark:text-neutral-100">Ready to make project with us?</h2>
											<p className="mt-2 max-w-2xl text-sm text-neutral-700 sm:text-base dark:text-neutral-400">Let's build something that not only looks great, but actually moves your business forward. Your next standout digital product starts here.</p>
										</div>

										<div className="flex justify-center md:justify-start">
											<Button asChild className="group my-3">
												<Link to="/contact-us">
													Contact Us
													<ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
												</Link>
											</Button>
										</div>
									</div>
								</div>

								{/* RIGHT CONTENT — CardSwap */}
								<div className="hidden justify-center lg:flex lg:w-1/3 lg:border-l lg:border-neutral-300 lg:pl-6">
									<CardSwap cardDistance={30} verticalDistance={40} delay={5000} pauseOnHover={false} height={300}>
										{movingCards.map((v, i) => (
											<Card key={i}>
												<div className="border-b border-gray-300 p-1.5">
													<h3 className="flex items-center gap-1 text-xs text-neutral-700">
														<v.icons size={12} /> https://{v.title}
													</h3>
												</div>
												<img src={v.img} alt={v.title} />
											</Card>
										))}
									</CardSwap>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default CallToAction;
