import { useState } from "react";
import { Badge } from "../ui/badge";
import aitherwayImage from "@/assets/images/aitherway.jpg";
import chatbotImage from "@/assets/images/chatbot.jpg";
import daunesiaImage from "@/assets/images/daunesia.jpg";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const blogFilters = [
	{ label: "All Articles", count: 12 },
	{ label: "Updates", count: 5 },
	{ label: "Spotlight", count: 3 },
];

const articles = [
	{
		date: "June 15, 2024",
		title: "Design Systems That Scale With Teams",
		description: "Learn how a strong design system improves consistency, speeds up delivery, and helps product teams build with confidence.",
		image: aitherwayImage,
		category: "Updates",
		alt: "Design systems planning board",
	},
	{
		date: "June 10, 2024",
		title: "Building Faster Frontends With Vite",
		description: "A practical look at how modern tooling can cut build time, improve DX, and keep large projects maintainable.",
		image: chatbotImage,
		category: "Spotlight",
		alt: "Developer workflow interface",
	},
	{
		date: "June 5, 2024",
		title: "Crafting Better User Journeys",
		description: "Explore simple UX strategies to reduce friction, improve engagement, and turn first-time visitors into loyal users.",
		image: daunesiaImage,
		category: "Updates",
		alt: "User journey wireframe overview",
	},
];

export default function BlogsCollection() {
	const [activeFilter, setActiveFilter] = useState("All Articles");

	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-350 border-dashed py-12 min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="px-6">
					<div className="text-left">
						<h2 className="max-w-4xl text-2xl leading-tight font-bold text-neutral-800 sm:text-3xl md:text-4xl lg:text-4xl dark:text-neutral-100">Explore Our Insights</h2>

						<p className="mt-2 max-w-2xl text-sm text-neutral-700 md:text-base dark:text-neutral-400">Discover our latest articles, ideas, and perspectives on design, technology, and innovation.</p>
					</div>
					<div className="mt-4 flex items-center justify-between gap-3">
						<input type="text" placeholder="Search articles..." className="w-200 rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-sm text-neutral-800 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-400" />
						<div className="flex gap-2">
							{blogFilters.map((item) => (
								<Badge
									key={item.label}
									variant="outline"
									onClick={() => setActiveFilter(item.label)}
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
					<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{articles.map((article) => (
							<div key={article.title} className="flex flex-col items-center border border-dashed">
								<div className="relative w-full overflow-hidden">
									<img src={article.image} alt={article.alt} className="h-56 w-full object-cover" loading="lazy" />
									<Badge variant={"default"} className="absolute top-4 left-4">
										{article.category}
									</Badge>
								</div>
								<div className="space-y-2 p-4">
									<p className="text-muted-foreground text-xs">{article.date}</p>
									<h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{article.title}</h3>
									<p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">{article.description}</p>
								</div>
								<div className="w-full px-4 pb-4">
									<Link
										to={"/"}
										className="group inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-800 transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-950"
									>
										<span>Read More</span>
										<span className="transition-transform group-hover:translate-x-0.5">
											<ArrowRight size={14} />
										</span>
									</Link>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
