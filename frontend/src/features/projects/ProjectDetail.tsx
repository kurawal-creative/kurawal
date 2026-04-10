import { Link, useParams } from "react-router-dom";

const dummyProject = {
	id: 1,
	name: "Kurawal Portfolio",
	github: "https://github.com/kurawal/portfolio",
	demo: "https://portfolio.kurawal.dev",
	status: "Production",
	description: "This is a brief description of the project.",
	env: "DATABASE_URL=postgresql://...\nAPI_KEY=123456\nPORT=3000",
	createdAt: "12 Jan 2026",
	updatedAt: "2 hours ago",
};

export default function ProjectDetail() {
	const { id } = useParams();

	return (
		<div className="p-4 uppercase tracking-tighter">
			<div className="flex justify-between items-center mb-6 border-b border-black pb-2">
				<h1 className="text-xl font-bold">Project / Details / {id}</h1>
				<Link to="/admin/project" className="border border-black px-4 py-1 hover:bg-gray-100">
					Back to List
				</Link>
			</div>

			<div className="border border-black p-4 space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="border-b md:border-b-0 md:border-r border-black pb-4 md:pb-0 md:pr-4">
						<p className="text-sm font-bold opacity-50">Project Name</p>
						<p className="text-lg">{dummyProject.name}</p>
					</div>
					<div>
						<p className="text-sm font-bold opacity-50">Status</p>
						<p className="text-lg">{dummyProject.status}</p>
					</div>
					<div className="border-b md:border-b-0 md:border-r border-black pb-4 md:pb-0 md:pr-4">
						<p className="text-sm font-bold opacity-50">GitHub URL</p>
						<p className="underline truncate">{dummyProject.github}</p>
					</div>
					<div>
						<p className="text-sm font-bold opacity-50">Demo URL</p>
						<p className="underline truncate">{dummyProject.demo}</p>
					</div>
					<div className="col-span-full border-t border-black pt-4">
						<p className="text-sm font-bold opacity-50">Description</p>
						<p className="mt-1 normal-case">{dummyProject.description}</p>
					</div>
					<div className="col-span-full border-t border-black pt-4">
						<p className="text-sm font-bold opacity-50">Environment Variables (ENV)</p>
						<textarea 
							className="mt-2 w-full border border-black p-2 h-32 font-mono text-sm normal-case bg-gray-50 cursor-default" 
							readOnly 
							value={dummyProject.env}
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
					<button className="border border-black px-6 py-2 text-red-600 hover:bg-red-50">
						Delete Project (Danger)
					</button>
				</div>
			</div>
		</div>
	);
}
