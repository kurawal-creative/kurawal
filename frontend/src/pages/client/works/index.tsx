import { useMemo, useState, useEffect } from "react";
import api from "@/utils/api";
import WorksHero from "@/components/client-side/works/WorksHeroSection";
import ProjectsShowcase from "@/components/client-side/works/WorksShowcaseSection";
import AwardsShowcase from "@/components/client-side/works/AwardsShowcaseSection";

export type ProjectCategory = "Education" | "Business" | "Landing Page" | "Dashboard";

export type ProjectItem = {
	id: string;
	name: string;
	category: ProjectCategory;
	description: string;
	images: string[];
};

export default function ProjectsPage() {
	const [activeFilter, setActiveFilter] = useState<string>("All");
	const [projects, setProjects] = useState<ProjectItem[]>([]);

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await api.get("/works");
				const projectsData = response.data.data || response.data;
				setProjects(Array.isArray(projectsData) ? projectsData : []);
			} catch (error) {
				console.error("Failed to fetch works", error);
			}
		};
		fetchProjects();
	}, []);

	const worksStats = useMemo(() => {
		const byCategory = projects.reduce<Record<ProjectCategory, number>>(
			(acc, project) => {
				if (project.category && Object.prototype.hasOwnProperty.call(acc, project.category)) {
					acc[project.category as ProjectCategory] += 1;
				}
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
	}, [projects]);

	return (
		<>
			<WorksHero worksStats={worksStats} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
			<ProjectsShowcase activeFilter={activeFilter} />
			<AwardsShowcase />
		</>
	);
}
