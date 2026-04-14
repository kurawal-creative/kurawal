import { Badge } from "../ui/badge";
import { Highlighter } from "../ui/highlighter";
import { Handshake, ShieldCheck, Sparkles, Users2 } from "lucide-react";

const values = [
	{
		title: "Innovation",
		description: "We constantly push the boundaries of what's possible, exploring new technologies and methodologies.",
		icon: Sparkles,
		badge: "Creative Thinking",
	},
	{
		title: "Quality",
		description: "We don't settle for good enough. We strive for excellence in every line of code and every pixel of design.",
		icon: ShieldCheck,
		badge: "Craftsmanship",
	},
	{
		title: "Integrity",
		description: "We believe in honest, transparent communication and building long-term relationships based on trust.",
		icon: Handshake,
		badge: "Trust First",
	},
	{
		title: "Collaboration",
		description: "We work closely with our clients and within our team to achieve shared goals and success.",
		icon: Users2,
		badge: "Team Spirit",
	},
];

const OurValues = () => {
	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-350 border-dashed py-12 min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="z-10 mx-auto px-6 text-center">
					<p className="font-caveat text-xl text-neutral-800 dark:text-neutral-100">
						<Highlighter action="underline" color="" padding={2} strokeWidth={1} iterations={2}>
							Our Core Values
						</Highlighter>
					</p>

					<h2 className="mt-4 text-3xl font-bold text-neutral-800 dark:text-neutral-100">What Drives Us</h2>
					<p className="mx-auto mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">These principles guide our work and shape our culture.</p>

					<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						{values.map((value, index) => {
							const Icon = value.icon;

							return (
								<div key={index} className="group relative overflow-hidden rounded-2xl border border-dashed bg-white/80 p-6 text-left shadow-sm transition-all duration-300 dark:bg-neutral-950/60">
									<div className="relative z-10 space-y-2">
										<Badge variant="outline" className="flex items-center gap-1">
											<Icon className="h-4 w-4 text-neutral-700 dark:text-neutral-200" aria-hidden="true" />
											<span>{value.badge}</span>
										</Badge>

										<h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">{value.title}</h3>
										<p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{value.description}</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>
		</>
	);
};

export default OurValues;
