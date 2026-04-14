import { Badge } from "../ui/badge";

type ProjectsItem = {
	name: string;
	category: string;
	description: string;
};

type ProjectsShowcaseProps = {
	projects: ProjectsItem[];
};

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-350 border-dashed min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="grid grid-cols-1 md:grid-cols-2">
					{projects.map((work, index) => (
						<div key={work.name} className={`overflow-hidden border-b border-dashed p-0.5 ${index % 2 === 0 ? "md:border-r" : ""}`}>
							<div className="group relative isolate min-h-72 overflow-hidden bg-neutral-300 dark:bg-neutral-800">
								<div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/10 via-black/15 to-black/60 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

								<Badge variant={"default"} className="absolute top-4 left-4">
									{work.name}
								</Badge>
								<Badge variant={"secondary"} className="absolute top-4 right-4">
									{work.category}
								</Badge>

								<div className="absolute inset-x-0 bottom-0 z-10 translate-y-6 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
									<p className="text-sm leading-relaxed text-white/95">{work.description}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</>
	);
}
