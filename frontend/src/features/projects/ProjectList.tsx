import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/utils/api";

interface Project {
	id: string;
	name: string;
	link_github: string;
	link_demo: string;
	status: string;
	createdAt: string;
}

export default function ProjectList() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await api.get("/projects");
				setProjects(response.data);
			} catch (error) {
				console.error("Failed to fetch projects", error);
			} finally {
				setLoading(false);
			}
		};
		fetchProjects();
	}, []);

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure?")) return;
		try {
			await api.delete(`/projects/${id}`);
			setProjects(projects.filter((p) => p.id !== id));
		} catch (error) {
			alert("Failed to delete project");
		}
	};

	if (loading) return <div className="p-4">LOADING PROJECTS...</div>;

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-xl font-bold uppercase">Project List</h1>
				<Link 
					to="/admin/project/create" 
					className="border border-black px-4 py-1 hover:bg-gray-100"
				>
					Add New
				</Link>
			</div>

			<div className="border border-black overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-black bg-gray-50">
							<th className="p-2 border-r border-black font-bold uppercase text-xs">Name</th>
							<th className="p-2 border-r border-black font-bold uppercase text-xs">GitHub</th>
							<th className="p-2 border-r border-black font-bold uppercase text-xs">Demo</th>
							<th className="p-2 border-r border-black font-bold uppercase text-xs">Status</th>
							<th className="p-2 font-bold uppercase text-xs text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
						{projects.length === 0 ? (
							<tr><td colSpan={5} className="p-4 text-center italic">No projects found.</td></tr>
						) : (
							projects.map((p) => (
								<tr key={p.id} className="border-b border-black last:border-0 hover:bg-gray-50">
									<td className="p-2 border-r border-black font-medium">{p.name}</td>
									<td className="p-2 border-r border-black text-xs truncate max-w-[150px]">
										{p.link_github ? <a href={p.link_github} target="_blank" className="underline">{p.link_github}</a> : "-"}
									</td>
									<td className="p-2 border-r border-black text-xs truncate max-w-[150px]">
										{p.link_demo ? <a href={p.link_demo} target="_blank" className="underline">{p.link_demo}</a> : "-"}
									</td>
									<td className="p-2 border-r border-black text-xs font-bold uppercase">{p.status}</td>
									<td className="p-2 space-x-2 text-xs text-right">
										<Link to={`/admin/project/${p.id}/edit`} className="underline text-blue-800">EDIT</Link>
										<Link to={`/admin/project/${p.id}`} className="underline text-black">DETAIL</Link>
										<button onClick={() => handleDelete(p.id)} className="underline text-red-600">DELETE</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
