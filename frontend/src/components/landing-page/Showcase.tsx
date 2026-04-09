import { Highlighter } from "../ui/highlighter";
import VideoCard from "../VideoCard";

import daunesia from "@/assets/video/daunesia.mp4";
import cetha from "@/assets/video/cetha.mp4";
import aitherway from "@/assets/video/aitherway.mp4";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const ShowcaseSection = () => {
	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-[1400px] border-dashed px-4 py-12 min-[1400px]:border-x min-[1800px]:max-w-[1536px]">
				<div className="z-10 mx-auto text-center">
					<p className="font-caveat text-xl text-neutral-800 dark:text-neutral-400">
						<Highlighter action="underline" color="" padding={2} strokeWidth={1} iterations={2}>
							Our Best Works
						</Highlighter>
					</p>

					<div className="mx-auto mt-5 flex flex-col items-center text-center">
						<h2 className="max-w-4xl text-center text-3xl leading-tight font-bold text-neutral-800 md:text-4xl lg:text-4xl dark:text-neutral-100">Showcasing Work That Delivers Real Impact</h2>
						<p className="mx-auto mt-2 max-w-2xl text-neutral-700 dark:text-neutral-400">Every project reflects our commitment to clarity, creativity, and reliable execution designed to elevate brands with measurable results.</p>
					</div>

					<div className="mt-12 grid grid-cols-1 gap-0.5 overflow-hidden border border-dashed p-0.5 md:grid-cols-4 lg:grid-cols-6 lg:border-t">
						<div className="col-span-1 grid overflow-hidden border-b border-dashed p-0.5 md:col-span-2 md:border-0 md:border-r lg:col-span-2">
							<VideoCard src={daunesia} title="Daunesia" desc="UI/UX & Landing Page Development" badges={["Ai", "Web Development"]} />
						</div>

						<div className="col-span-1 grid overflow-hidden border-dashed p-0.5 sm:col-span-3 md:col-span-2 lg:col-span-4">
							<VideoCard src={aitherway} title="Aitherway" desc="Showcase Motion & Interaction" badges={["Ai", "Web Development"]} />
						</div>
					</div>

					<div className="grid grid-cols-1 overflow-hidden border border-dashed p-0.5">
						<div className="col-span-1 grid overflow-hidden border-dashed p-0.5">
							<VideoCard src={cetha} title="Cetha" desc="Branding & Motion Design" badges={["Ai", "Web Development"]} />
						</div>
					</div>

					<Button asChild className="group my-6">
						<Link to="/projects">
							Show More <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
						</Link>
					</Button>
				</div>
			</section>
		</>
	);
};

export default ShowcaseSection;
