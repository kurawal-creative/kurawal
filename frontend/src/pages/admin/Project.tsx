import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, FolderGit2, Pencil, Plus, Settings } from "lucide-react";

type ProjectStatus = "Production" | "Preview" | "Archived";

interface ProjectRow {
	id: number;
	name: string;
	github: string;
	demo: string;
	status: ProjectStatus;
	image: string;
	updatedAt: string;
}

const dummyProjects: ProjectRow[] = [
	{
		id: 1,
		name: "Kurawal Portfolio",
		github: "https://github.com/kurawal/portfolio",
		demo: "https://portfolio.kurawal.dev",
		status: "Production",
		image: "https://picsum.photos/200/300?random=1",
		updatedAt: "2 hours ago",
	},
	{
		id: 2,
		name: "Admin Dashboard",
		github: "https://github.com/kurawal/admin-dashboard",
		demo: "-",
		status: "Preview",
		image: "https://picsum.photos/200/300?random=2",
		updatedAt: "1 day ago",
	},
	{
		id: 3,
		name: "Landing Page Redesign",
		github: "https://github.com/kurawal/landing-page",
		demo: "https://landing.kurawal.dev",
		status: "Archived",
		image: "https://picsum.photos/200/300?random=3",
		updatedAt: "5 days ago",
	},
];

const statusStyles: Record<ProjectStatus, string> = {
	Production: "bg-green-100 text-green-800",
	Preview: "bg-blue-100 text-blue-800",
	Archived: "bg-gray-100 text-gray-800",
};

export default function AdminProjectPage() {
	return (
		<AdminLayout>
			<div className="space-y-6 pb-8">
				<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
					<div>
						<div className="flex items-center gap-2">
							<FolderGit2 className="text-muted-foreground h-6 w-6" />
							<h1 className="text-3xl font-bold tracking-tight">Project</h1>
						</div>
						<p className="text-muted-foreground mt-2">Halaman list project saja. Detail, create, update, dan environment variables ada di halaman terpisah.</p>
					</div>

					<div className="flex gap-2">
						<Button asChild>
							<Link to="/admin/project/create">
								<Plus className="mr-2 h-4 w-4" />
								New Project
							</Link>
						</Button>
					</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Project List</CardTitle>
						<CardDescription>Dummy data untuk tampilan awal. Tidak ada env di tabel ini.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-hidden rounded-md border">
							<table className="w-full text-sm">
								<thead className="bg-muted/50">
									<tr>
										<th className="px-4 py-3 text-left font-medium">No</th>
										<th className="px-4 py-3 text-left font-medium">Image</th>
										<th className="px-4 py-3 text-left font-medium">Name</th>
										<th className="px-4 py-3 text-left font-medium">GitHub</th>
										<th className="px-4 py-3 text-left font-medium">Demo</th>
										<th className="px-4 py-3 text-left font-medium">Status</th>
										<th className="px-4 py-3 text-left font-medium">Updated</th>
										<th className="px-4 py-3 text-right font-medium">Actions</th>
									</tr>
								</thead>
								<tbody>
									{dummyProjects.map((project, index) => (
										<tr key={project.id} className="border-t">
											<td className="px-4 py-4 font-medium">{index + 1}</td>
											<td className="px-4 py-4">
												<img src={project.image} alt={project.name} className="h-16 w-24 rounded-md object-cover" />
											</td>
											<td className="px-4 py-4 font-medium">
												<div className="flex flex-col">
													<span>{project.name}</span>
													<span className="text-muted-foreground text-xs">Project overview</span>
												</div>
											</td>
											<td className="px-4 py-4">
												{project.github !== "-" ? (
													<a href={project.github} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
														GitHub
													</a>
												) : (
													<span className="text-muted-foreground">-</span>
												)}
											</td>
											<td className="px-4 py-4">
												{project.demo !== "-" ? (
													<a href={project.demo} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
														Demo
													</a>
												) : (
													<span className="text-muted-foreground">-</span>
												)}
											</td>
											<td className="px-4 py-4">
												<span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusStyles[project.status]}`}>{project.status}</span>
											</td>
											<td className="text-muted-foreground px-4 py-4">{project.updatedAt}</td>
											<td className="px-4 py-4">
												<div className="flex justify-end gap-2">
													<Button asChild size="sm" variant="outline">
														<Link to={`/admin/project/${project.id}`}>
															<ArrowRight className="mr-2 h-4 w-4" />
															Detail
														</Link>
													</Button>
													<Button asChild size="sm" variant="outline">
														<Link to={`/admin/project/${project.id}/edit`}>
															<Pencil className="mr-2 h-4 w-4" />
															Edit
														</Link>
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>

				<Card className="border-dashed">
					<CardHeader>
						<CardTitle>Pages yang disiapkan</CardTitle>
						<CardDescription>Halaman detail, create, dan update akan punya form env masing-masing.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						<Button asChild variant="outline">
							<Link to="/admin/project/create">
								<Plus className="mr-2 h-4 w-4" />
								Create Page
							</Link>
						</Button>
						<Button asChild variant="outline">
							<Link to="/admin/project/1">
								<FolderGit2 className="mr-2 h-4 w-4" />
								Detail Page
							</Link>
						</Button>
						<Button asChild variant="outline">
							<Link to="/admin/project/1/edit">
								<Settings className="mr-2 h-4 w-4" />
								Update Page
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</AdminLayout>
	);
}
