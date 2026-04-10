import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "@/utils/api";

interface Project {
	id: string;
	name: string;
	description: string | null;
	link_github: string | null;
	link_demo: string | null;
	status: string;
	env: string | null;
	createdAt: string;
	updatedAt: string;
}

export default function ProjectDetail() {
	const { id } = useParams();
	const [project, setProject] = useState<Project | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProject = async () => {
			try {
				const response = await api.get(`/projects/${id}`);
				setProject(response.data);
			} catch (error) {
				console.error("Failed to fetch project detail", error);
			} finally {
				setLoading(false);
			}
		};
		fetchProject();
	}, [id]);

	if (loading) return <div className="p-4">LOADING DETAIL...</div>;
	if (!project) return <div className="p-4 uppercase border border-red-500">Project Not Found</div>;

	return (
		<div className="p-4 uppercase tracking-tighter">
			<div className="flex justify-between items-center mb-6 border-b border-black pb-2">
				<h1 className="text-xl font-bold">Project / Details / {project.name}</h1>
				<Link to="/admin/project" className="border border-black px-4 py-1 hover:bg-gray-100">
					Back to List
				</Link>
			</div>

			<div className="border border-black p-4 space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="border-b md:border-b-0 md:border-r border-black pb-4 md:pb-0 md:pr-4">
						<p className="text-sm font-bold opacity-50">Project Name</p>
						<p className="text-lg">{project.name}</p>
					</div>
					<div>
						<p className="text-sm font-bold opacity-50">Status</p>
						<p className="text-lg">{project.status}</p>
					</div>
					<div className="border-b md:border-b-0 md:border-r border-black pb-4 md:pb-0 md:pr-4">
						<p className="text-sm font-bold opacity-50">GitHub URL</p>
						<p className="underline truncate lowercase">{project.link_github || "-"}</p>
					</div>
					<div>
						<p className="text-sm font-bold opacity-50">Demo URL</p>
						<p className="underline truncate lowercase">{project.link_demo || "-"}</p>
					</div>
					<div className="col-span-full border-t border-black pt-4">
						<p className="text-sm font-bold opacity-50">Description</p>
						<p className="mt-1 normal-case">{project.description || "N/A"}</p>
					</div>
					<div className="col-span-full border-t border-black pt-4">
						<p className="text-sm font-bold opacity-50">Environment Variables (ENV)</p>
						<textarea 
							className="mt-2 w-full border border-black p-2 h-32 font-mono text-sm normal-case bg-gray-50 cursor-text" 
							readOnly 
							defaultValue={project.env || ""}
						/>
					</div>
				</div>

				<div className="mt-6 flex gap-4 pt-4 border-t border-black">
					<Link 
						to={`/admin/project/${id}/edit`} 
						className="border border-black px-6 py-2 bg-black text-white hover:bg-gray-800"
					>
						Edit Project
					</Link>
					<p className="text-[10px] items-center flex opacity-50">Last update: {new Date(project.updatedAt).toLocaleString()}</p>
				</div>
			</div>
		</div>
	);
}
