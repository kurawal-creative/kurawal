import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Badge } from "../../ui/badge";

type Award = {
	id: string;
	title: string;
	tagIds: string[];
	images: string[];
	date: string;
	description: string;
	institution: string;
	location: string;
};

export default function AwardsShowcaseSection() {
	const [awards, setAwards] = useState<Award[]>([]);

	useEffect(() => {
		const fetchAwards = async () => {
			try {
				const response = await api.get("/awards");
				const awardsData = response.data.data || response.data;
				setAwards(Array.isArray(awardsData) ? awardsData : []);
			} catch (error) {
				console.error("Failed to fetch awards", error);
			}
		};
		fetchAwards();
	}, []);

	// Jika tidak ada data, tidak render apapun
	if (awards.length === 0) {
		return null;
	}

	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-350 border-dashed py-12 min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="mx-auto flex flex-col items-center text-center">
					<h2 className="max-w-4xl text-center text-2xl leading-tight font-bold text-neutral-800 sm:text-3xl md:text-4xl lg:text-4xl dark:text-neutral-100">Winning Solutions That Drive Results</h2>

					<p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-700 md:text-base dark:text-neutral-400">Recognized for delivering innovative digital experiences that combine stunning design with powerful functionality. Our portfolio reflects a commitment to excellence across every project we undertake.</p>
				</div>
				<div className="mx-auto w-full max-w-7xl">
					<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
						{awards.map((item) => (
							<article key={item.id} className="overflow-hidden border border-dashed">
								<div className="relative h-48 w-full overflow-hidden">
									{item.images[0] && <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" loading="lazy" />}
									{item.tagIds.length > 0 && (
										<Badge variant={"default"} className="absolute top-3 left-3">
											{item.tagIds[0]}
										</Badge>
									)}
								</div>
								<div className="space-y-2 p-4 text-left">
									<p className="text-xs text-neutral-500 dark:text-neutral-400">{new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
									<h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{item.title}</h3>
									<p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
									<div className="space-y-1 border-t border-dashed border-neutral-300 pt-3 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
										<p>
											<span className="font-semibold text-neutral-800 dark:text-neutral-100">Institution:</span> {item.institution}
										</p>
										<p>
											<span className="font-semibold text-neutral-800 dark:text-neutral-100">Location:</span> {item.location}
										</p>
									</div>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
