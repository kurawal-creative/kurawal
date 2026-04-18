import { useMemo, useState } from "react";
import WorksHero from "@/components/works/WorksHero";
import ProjectsShowcase from "@/components/works/ProjectsShowcase";
import AwardsShowcase from "@/components/works/AwardsShowcase";

export type ProjectCategory = "Education" | "Business" | "Landing Page" | "Dashboard";

export type ProjectItem = {
	name: string;
	category: ProjectCategory;
	description: string;
};

const projects: ProjectItem[] = [
	{
		name: "EduSpark",
		category: "Education",
		description: "Platform belajar interaktif untuk kelas online dengan dashboard progress siswa.",
	},
	{
		name: "BizFlow",
		category: "Business",
		description: "Aplikasi manajemen operasional bisnis untuk workflow tim dan laporan harian.",
	},
	{
		name: "LaunchNest",
		category: "Landing Page",
		description: "Landing page konversi tinggi untuk campaign produk digital dan lead generation.",
	},
	{
		name: "PulseBoard",
		category: "Dashboard",
		description: "Dashboard analitik realtime untuk monitoring KPI dan insight performa produk.",
	},
];

export default function ProjectsPage() {
	const [activeFilter, setActiveFilter] = useState<string>("All");

	const worksStats = useMemo(() => {
		const byCategory = projects.reduce<Record<ProjectCategory, number>>(
			(acc, project) => {
				acc[project.category] += 1;
				return acc;
			},
			{
				Education: 0,
				Business: 0,
				"Landing Page": 0,
				Dashboard: 0,
			},
		);

		return [{ label: "All", count: projects.length }, ...Object.entries(byCategory).map(([label, count]) => ({ label, count }))];
	}, []);

	const filteredProjects = useMemo(() => {
		if (activeFilter === "All") {
			return projects;
		}

		return projects.filter((project) => project.category === activeFilter);
	}, [activeFilter]);

	return (
		<>
			<WorksHero worksStats={worksStats} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
			<ProjectsShowcase projects={filteredProjects} />
			<AwardsShowcase />
		</>
	);
}
