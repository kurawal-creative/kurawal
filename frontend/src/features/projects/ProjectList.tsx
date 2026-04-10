import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/utils/api";

interface Project {
	id: string;
	name: string;
	images: string[];
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
			<div className="mb-4 flex items-center justify-between">
				<h1 className="text-xl font-bold uppercase">Project List</h1>
				<Link to="/admin/project/create" className="border border-black px-4 py-1 hover:bg-gray-100">
					Add New
				</Link>
			</div>

			<div className="overflow-x-auto border border-black">
				<table className="w-full border-collapse text-left">
					<thead>
						<tr className="border-b border-black bg-gray-50">
							<th className="w-16 border-r border-black p-2 text-center text-xs font-bold uppercase">Img</th>
							<th className="border-r border-black p-2 text-xs font-bold uppercase">Name</th>
							<th className="border-r border-black p-2 text-xs font-bold uppercase">GitHub</th>
							<th className="border-r border-black p-2 text-xs font-bold uppercase">Demo</th>
							<th className="border-r border-black p-2 text-xs font-bold uppercase">Status</th>
							<th className="p-2 text-right text-xs font-bold uppercase">Actions</th>
						</tr>
					</thead>
					<tbody>
						{projects.length === 0 ? (
							<tr>
								<td colSpan={6} className="p-4 text-center italic">
									No projects found.
								</td>
							</tr>
						) : (
							projects.map((p) => (
								<tr key={p.id} className="border-b border-black last:border-0 hover:bg-gray-50">
									<td className="flex items-center justify-center border-r border-black p-2">{p.images && p.images.length > 0 ? <img src={p.images[0]} alt={p.name} className="h-10 w-10 border border-black object-cover grayscale transition-all group-hover:grayscale-0" /> : <div className="flex h-10 w-10 items-center justify-center border border-black bg-gray-100 text-[10px] opacity-30">N/A</div>}</td>
									<td className="border-r border-black p-2 font-medium">{p.name}</td>
									<td className="max-w-[150px] truncate border-r border-black p-2 text-xs">
										{p.link_github ? (
											<a href={p.link_github} target="_blank" className="underline">
												{p.link_github}
											</a>
										) : (
											"-"
										)}
									</td>
									<td className="max-w-[150px] truncate border-r border-black p-2 text-xs">
										{p.link_demo ? (
											<a href={p.link_demo} target="_blank" className="underline">
												{p.link_demo}
											</a>
										) : (
											"-"
										)}
									</td>
									<td className="border-r border-black p-2 text-xs font-bold uppercase">{p.status}</td>
									<td className="space-x-2 p-2 text-right text-xs">
										<Link to={`/admin/project/${p.id}/edit`} className="text-blue-800 underline">
											EDIT
										</Link>
										<Link to={`/admin/project/${p.id}`} className="text-black underline">
											DETAIL
										</Link>
										<button onClick={() => handleDelete(p.id)} className="text-red-600 underline">
											DELETE
										</button>
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
