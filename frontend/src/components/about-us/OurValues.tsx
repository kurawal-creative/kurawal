import { Highlighter } from "../ui/highlighter";

const values = [
	{
		title: "Innovation",
		description: "We constantly push the boundaries of what's possible, exploring new technologies and methodologies.",
	},
	{
		title: "Quality",
		description: "We don't settle for good enough. We strive for excellence in every line of code and every pixel of design.",
	},
	{
		title: "Integrity",
		description: "We believe in honest, transparent communication and building long-term relationships based on trust.",
	},
	{
		title: "Collaboration",
		description: "We work closely with our clients and within our team to achieve shared goals and success.",
	},
];

const OurValues = () => {
	return (
		<section className="relative mx-auto max-w-[1400px] border-dashed py-12 min-[1400px]:border-x min-[1800px]:max-w-[1536px]">
			<div className="z-10 mx-auto px-6 text-center">
				<p className="font-caveat text-xl text-neutral-800 dark:text-neutral-100">
					<Highlighter action="underline" color="" padding={2} strokeWidth={1} iterations={2}>
						Our Core Values
					</Highlighter>
				</p>

				<h2 className="mt-4 text-3xl font-bold text-neutral-800 dark:text-neutral-100">What Drives Us</h2>
				<p className="mx-auto mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">These principles guide our work and shape our culture.</p>

				<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{values.map((value, index) => (
						<div key={index} className="rounded-lg border border-dashed p-6 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900">
							<h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">{value.title}</h3>
							<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{value.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default OurValues;
