import aitherwayImage from "@/assets/images/aitherway.jpg";
import chatbotImage from "@/assets/images/chatbot.jpg";
import daunesiaImage from "@/assets/images/daunesia.jpg";
import { Badge } from "../ui/badge";

const achievements = [
	{
		title: "Top Digital Product Experience 2025",
		institution: "Indonesia Product Design Forum",
		date: "12 March 2025",
		location: "Jakarta",
		category: "UX & Product",
		image: aitherwayImage,
		description: "Awarded for successfully designing a digital product flow that improved user retention and client satisfaction.",
	},
	{
		title: "Best Innovation in Web Engineering",
		institution: "ASEAN Technology Summit",
		date: "08 November 2024",
		location: "Singapore",
		category: "Engineering",
		image: chatbotImage,
		description: "Recognized for implementing a modern frontend architecture that accelerated app performance and time-to-market.",
	},
	{
		title: "Creative Impact Award",
		institution: "Nusantara Creative Council",
		date: "21 July 2024",
		location: "Bandung",
		category: "Brand & Visual",
		image: daunesiaImage,
		description: "Acknowledged for delivering a strong and consistent visual experience that contributed to higher brand conversion.",
	},
];

export default function AwardsShowcase() {
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
						{achievements.map((item) => (
							<article key={item.title} className="overflow-hidden border border-dashed">
								<div className="relative h-48 w-full overflow-hidden">
									<img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
									<Badge variant={"default"} className="absolute top-3 left-3">
										{item.category}
									</Badge>
								</div>
								<div className="space-y-2 p-4 text-left">
									<p className="text-xs text-neutral-500 dark:text-neutral-400">{item.date}</p>
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
