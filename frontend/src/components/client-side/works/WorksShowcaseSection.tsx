import { useState, useEffect, useMemo } from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Github, Globe } from "lucide-react";
import api from "@/utils/api";
import WorksCardSkeleton from "@/components/skeleton/WorksCardSkeleton";

type WorksItem = {
	id: string;
	name: string;
	category: string;
	description: string;
	images: string[];
	link_github: string | null;
	link_demo: string | null;
};

type WorksShowcaseSectionProps = {
	activeFilter: string;
};

export default function WorksShowcaseSection({ activeFilter }: WorksShowcaseSectionProps) {
	const [showAll, setShowAll] = useState(false);
	const [works, setWorks] = useState<WorksItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchWorks = async () => {
			try {
				const response = await api.get("/works");
				const worksData = response.data.data || response.data;
				setWorks(Array.isArray(worksData) ? worksData : []);
			} catch (error) {
				console.error("Failed to fetch works", error);
			} finally {
				setLoading(false);
			}
		};
		fetchWorks();
	}, []);

	const filteredWorks = useMemo(() => {
		if (activeFilter === "All") {
			return works;
		}
		return works.filter((work) => work.category === activeFilter);
	}, [activeFilter, works]);

	const displayedWorks = showAll ? filteredWorks : filteredWorks.slice(0, 4);
	const hasMore = filteredWorks.length > 4;

	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-350 border-dashed min-[1400px]:border-x min-[1800px]:max-w-384">
				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2">
						{[...Array(4)].map((_, index) => (
							<div key={index} className={index % 2 === 0 ? "md:border-r" : ""}>
								<WorksCardSkeleton />
							</div>
						))}
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2">
							{displayedWorks.map((work, index) => (
								<div key={work.id} className={`overflow-hidden border-b border-dashed p-0.5 ${index % 2 === 0 ? "md:border-r" : ""}`}>
									<div className="group relative isolate min-h-80 overflow-hidden bg-neutral-300 dark:bg-neutral-800">
										{/* Image */}
										{work.images?.[0] && <img src={work.images[0]} alt={work.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}

										{/* Overlay */}
										<div className="absolute inset-0 bg-linear-to-b from-black/5 via-black/10 to-black/40 transition-opacity duration-300 group-hover:from-black/10 group-hover:via-black/15 group-hover:to-black/50" />

										{/* Links */}
										{(work.link_github || work.link_demo) && (
											<div className="absolute top-4 left-4 z-10 flex gap-2">
												{work.link_github && (
													<a href={work.link_github} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/50" onClick={(e) => e.stopPropagation()}>
														<Github className="h-4 w-4 text-white" />
													</a>
												)}

												{work.link_demo && (
													<a href={work.link_demo} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/50" onClick={(e) => e.stopPropagation()}>
														<Globe className="h-4 w-4 text-white" />
													</a>
												)}
											</div>
										)}

										{/* Category */}
										{work.category && (
											<Badge variant="secondary" className="absolute top-4 right-4 z-10 border-white/10 bg-white/10 text-white backdrop-blur-md">
												{work.category}
											</Badge>
										)}

										{/* Content */}
										<div className="absolute inset-x-0 bottom-0 z-10 p-6">
											<div className={`flex items-center gap-2 ${work.description ? "mb-3" : ""}`}>
												<Badge className="border-white/20 bg-white/10 text-white backdrop-blur-md transition-all group-hover:bg-white/15">{work.name}</Badge>
											</div>

											{work.description && <p className="line-clamp-2 text-sm leading-relaxed text-white/80 transition-colors duration-300 group-hover:text-white">{work.description}</p>}
										</div>
									</div>
								</div>
							))}
						</div>

						{hasMore && (
							<div className="flex justify-center border-b border-dashed py-8">
								<Button variant="outline" onClick={() => setShowAll(!showAll)}>
									{showAll ? "Show Less" : "Show More"}
								</Button>
							</div>
						)}
					</>
				)}
			</section>
		</>
	);
}
