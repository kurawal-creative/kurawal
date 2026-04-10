import { Link } from "react-router-dom";

const dummyProjects = [
	{
		id: 1,
		name: "Kurawal Portfolio",
		github: "https://github.com/kurawal/portfolio",
		demo: "https://portfolio.kurawal.dev",
		status: "Production",
		createdAt: "12 Jan 2026",
	},
	{
		id: 2,
		name: "Admin Dashboard",
		github: "https://github.com/kurawal/admin-dashboard",
		demo: "-",
		status: "Preview",
		createdAt: "10 Jan 2026",
	},
	{
		id: 3,
		name: "Landing Page Redesign",
		github: "https://github.com/kurawal/landing-page",
		demo: "https://landing.kurawal.dev",
		status: "Archived",
		createdAt: "5 Jan 2026",
	},
];

export default function ProjectList() {
	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-xl font-bold">Project List</h1>
				<Link 
					to="/admin/project/create" 
					className="border border-black px-4 py-1 hover:bg-gray-100"
				>
					Add New
				</Link>
			</div>

			<div className="border border-black">
				<table className="w-full text-left">
					<thead>
						<tr className="border-b border-black">
							<th className="p-2 border-r border-black">ID</th>
							<th className="p-2 border-r border-black">Name</th>
							<th className="p-2 border-r border-black">GitHub</th>
							<th className="p-2 border-r border-black">Demo</th>
							<th className="p-2 border-r border-black">Status</th>
							<th className="p-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{dummyProjects.map((p) => (
							<tr key={p.id} className="border-b border-black last:border-0">
								<td className="p-2 border-r border-black">{p.id}</td>
								<td className="p-2 border-r border-black">{p.name}</td>
								<td className="p-2 border-r border-black underline">{p.github}</td>
								<td className="p-2 border-r border-black">{p.demo}</td>
								<td className="p-2 border-r border-black">{p.status}</td>
								<td className="p-2 space-x-2 text-sm text-blue-600">
									<Link to={`/admin/project/${p.id}/edit`} className="hover:underline">Edit</Link>
									<Link to={`/admin/project/${p.id}`} className="hover:underline">Detail</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
