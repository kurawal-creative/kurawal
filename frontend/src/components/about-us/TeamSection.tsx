import { Highlighter } from "../ui/highlighter";

// Placeholder images - in a real app these would be imported
const team = [
	{
		name: "John Doe",
		role: "CEO & Founder",
		image: "https://ui.shadcn.com/avatars/01.png",
	},
	{
		name: "Jane Smith",
		role: "CTO",
		image: "https://ui.shadcn.com/avatars/02.png",
	},
	{
		name: "Mike Johnson",
		role: "Lead Designer",
		image: "https://ui.shadcn.com/avatars/03.png",
	},
	{
		name: "Sarah Williams",
		role: "Senior Developer",
		image: "https://ui.shadcn.com/avatars/04.png",
	},
];

const TeamSection = () => {
	return (
		<section className="relative mx-auto max-w-[1400px] border-dashed py-12 min-[1400px]:border-x min-[1800px]:max-w-[1536px]">
			<div className="z-10 mx-auto px-6 text-center">
				<p className="font-caveat text-xl text-neutral-800 dark:text-neutral-100">
					<Highlighter action="underline" color="" padding={2} strokeWidth={1} iterations={2}>
						Meet the Team
					</Highlighter>
				</p>

				<h2 className="mt-4 text-3xl font-bold text-neutral-800 dark:text-neutral-100">The Minds Behind Kurawal</h2>
				<p className="mx-auto mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">Talented individuals working together to create amazing things.</p>

				<div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{team.map((member, index) => (
						<div key={index} className="flex flex-col items-center">
							<div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-700">
								<img src={member.image} alt={member.name} className="h-full w-full object-cover" />
							</div>
							<h3 className="mt-4 text-lg font-semibold text-neutral-800 dark:text-neutral-100">{member.name}</h3>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">{member.role}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default TeamSection;
