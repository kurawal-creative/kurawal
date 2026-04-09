import { cn } from "@/lib/utils";
import { CardStack } from "./ui/card-stack";
export function CardStackGrid() {
	return (
		<div className="flex w-full items-center justify-center">
			<CardStack items={CARDS} />
		</div>
	);
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({ children, className }: { children: React.ReactNode; className?: string }) => {
	return <span className={cn("rounded-md bg-[#0F828C]/10 px-1.5 py-0.5 font-bold text-[#0F828C]", "dark:bg-[#0F828C]/20 dark:text-[#94C8CD]", className)}>{children}</span>;
};

const CARDS = [
	{
		id: 0,
		name: "Next.js",
		username: "nextjs",
		designation: "The React Framework",
		avatar: "https://avatars.githubusercontent.com/u/14985020?s=200&v=4",
		content: (
			<p>
				<Highlight>File-system routing</Highlight> + <Highlight>App Router</Highlight> changed everything. We shipped our enterprise dashboard in 3 weeks instead of 3 months.
			</p>
		),
	},

	{
		id: 1,
		name: "Tailwind CSS",
		username: "tailwindcss",
		designation: "Rapidly build modern UIs",
		avatar: "https://avatars.githubusercontent.com/u/67109815?s=200&v=4",
		content: (
			<p>
				No more context switching between CSS files.
				<Highlight>Designers → Developers handoff</Highlight> is now literally instant.
			</p>
		),
	},

	{
		id: 2,
		name: "MongoDB",
		username: "mongodb",
		designation: "Flexible NoSQL Database",
		avatar: "https://avatars.githubusercontent.com/u/45120?s=200&v=4",
		content: (
			<p>
				Schema-less design + horizontal scaling let us ship features <Highlight>3× faster</Highlight> than with SQL. Atlas Serverless reduced our ops overhead to basically zero.
			</p>
		),
	},

	{
		id: 3,
		name: "Vercel",
		username: "vercel",
		designation: "Frontend Cloud",
		avatar: "https://avatars.githubusercontent.com/u/14985020?s=200&v=4",
		content: (
			<p>
				<Highlight>Preview URLs on every push</Highlight> + zero-config Edge Network. Our marketing team now ships landing pages without engineering help.
			</p>
		),
	},

	{
		id: 4,
		name: "shadcn/ui",
		username: "shadcn",
		designation: "Beautifully designed components",
		avatar: "https://avatars.githubusercontent.com/u/124599?s=200&v=4",
		content: (
			<p>
				Copy-paste components that just work with Tailwind. Our design system went from 4 months to <Highlight>4 days</Highlight>.
			</p>
		),
	},
];
