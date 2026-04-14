import { Highlighter } from "../ui/highlighter";
import { Github, Globe } from "lucide-react";

const teamMembers = [
	{ name: "Team Member 01", role: "Frontend Engineer", portfolio: "#", github: "#", image: "https://placehold.co/600x800/e9e9e9/666666?text=Profile+01" },
	{ name: "Team Member 02", role: "Backend Engineer", portfolio: "#", github: "#", image: "https://placehold.co/600x800/e6e6e6/5e5e5e?text=Profile+02" },
	{ name: "Team Member 03", role: "UI/UX Designer", portfolio: "#", github: "#", image: "https://placehold.co/600x800/ededed/626262?text=Profile+03" },
	{ name: "Team Member 04", role: "Fullstack Engineer", portfolio: "#", github: "#", image: "https://placehold.co/600x800/e8e8e8/5b5b5b?text=Profile+04" },
	{ name: "Team Member 05", role: "Project Lead", portfolio: "#", github: "#", image: "https://placehold.co/600x800/efefef/5a5a5a?text=Profile+05" },
];

const TeamSection = () => {
	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-350 border-dashed py-12 min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="z-10 mx-auto px-6 text-center">
					<p className="font-caveat text-xl text-neutral-800 dark:text-neutral-100">
						<Highlighter action="underline" color="" padding={2} strokeWidth={1} iterations={2}>
							Meet the Team
						</Highlighter>
					</p>

					<h2 className="mt-4 text-3xl font-bold text-neutral-800 dark:text-neutral-100">The Minds Behind Kurawal</h2>
					<p className="mx-auto mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">Talented individuals working together to create amazing things.</p>
				</div>

				<div className="mt-12 px-6">
					<div className="grid grid-cols-1 gap-x-2 gap-y-3 border-y border-dashed py-8 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-4 md:grid-cols-6">
						{teamMembers.map((member, index) => (
							<div key={member.name} className={`group relative h-80 w-full max-w-full justify-self-center overflow-hidden rounded-2xl border border-dashed bg-neutral-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:col-span-2 dark:bg-neutral-900 ${index === 3 ? "md:col-start-2" : ""} ${index === 4 ? "md:col-start-4" : ""}`}>
								<img src={member.image} alt={member.name} className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" loading="lazy" />

								<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent opacity-65 transition-opacity duration-300 group-hover:opacity-100" />

								<div className="absolute inset-x-0 bottom-0 z-10 translate-y-2 p-4 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
									<p className="text-sm font-semibold">{member.name}</p>
									<p className="text-xs text-neutral-200">{member.role}</p>
									<div className="mt-3 flex items-center gap-2">
										<a href={member.portfolio} aria-label={`Visit portfolio of ${member.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/40 bg-black/20 text-white transition-colors hover:bg-white hover:text-black">
											<Globe className="h-4 w-4" aria-hidden="true" />
										</a>
										<a href={member.github} aria-label={`Visit GitHub of ${member.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/40 bg-black/20 text-white transition-colors hover:bg-white hover:text-black">
											<Github className="h-4 w-4" aria-hidden="true" />
										</a>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default TeamSection;
