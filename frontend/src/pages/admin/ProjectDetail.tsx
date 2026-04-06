import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Plus, FolderGit2, ExternalLink, Eye, EyeOff, Copy } from "lucide-react";
import { Link } from "react-router-dom";

type EnvType = "Public" | "Secret";

interface EnvItem {
	key: string;
	value: string;
	type: EnvType;
}

interface ProjectEnvGroup {
	title: string;
	description: string;
	items: EnvItem[];
}

const dummyProject = {
	id: 1,
	name: "Kurawal Portfolio",
	description: "Personal portfolio website with modern UI and animated interactions.",
	github: "https://github.com/kurawal/portfolio",
	demo: "https://portfolio.kurawal.dev",
	status: "Production",
	image: "https://picsum.photos/200/300?random=1",
	framework: "Next.js",
	updatedAt: "2 hours ago",
};

const envGroups: ProjectEnvGroup[] = [
	{
		title: "Production",
		description: "Used for live deployment",
		items: [
			{ key: "NEXT_PUBLIC_API_URL", value: "https://api.kurawal.dev", type: "Public" },
			{ key: "NEXTAUTH_SECRET", value: "••••••••••••••••", type: "Secret" },
			{ key: "DATABASE_URL", value: "postgresql://••••••••", type: "Secret" },
		],
	},
	{
		title: "Preview",
		description: "Used for preview builds and staging",
		items: [
			{ key: "NEXT_PUBLIC_API_URL", value: "https://preview-api.kurawal.dev", type: "Public" },
			{ key: "NEXTAUTH_SECRET", value: "••••••••••••••••", type: "Secret" },
		],
	},
	{
		title: "Development",
		description: "Used for local development",
		items: [
			{ key: "NEXT_PUBLIC_API_URL", value: "http://localhost:3000/api", type: "Public" },
			{ key: "NEXTAUTH_SECRET", value: "dev-secret", type: "Secret" },
			{ key: "DATABASE_URL", value: "mongodb://localhost:27017/kurawal", type: "Secret" },
		],
	},
];

const statusClass: Record<string, string> = {
	Production: "bg-green-100 text-green-800",
	Preview: "bg-blue-100 text-blue-800",
	Archived: "bg-gray-100 text-gray-800",
};

export default function AdminProjectDetailPage() {
	return (
		<AdminLayout>
			<div className="space-y-6 pb-8">
				<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<FolderGit2 className="text-muted-foreground h-6 w-6" />
							<h1 className="text-3xl font-bold tracking-tight">Project Detail</h1>
						</div>
						<p className="text-muted-foreground max-w-2xl">
							Halaman detail project dummy dengan section environment variables ala Vercel. Dari sini nanti kamu bisa melihat, menambah, atau mengubah env per project.
						</p>

						<div className="flex flex-wrap gap-2">
							<Button asChild variant="outline">
								<Link to="/admin/project">
									<ArrowLeft className="mr-2 h-4 w-4" />
									Back
								</Link>
							</Button>
							<Button asChild variant="outline">
								<Link to={`/admin/project/${dummyProject.id}/edit`}>
									<Pencil className="mr-2 h-4 w-4" />
									Edit Project
								</Link>
							</Button>
							<Button className="opacity-60" disabled>
								<Plus className="mr-2 h-4 w-4" />
								Add Env
							</Button>
						</div>
					</div>

					<div className="bg-card flex w-full max-w-sm items-center gap-4 rounded-xl border p-4 shadow-sm">
						<img src={dummyProject.image} alt={dummyProject.name} className="h-20 w-28 rounded-lg object-cover" />
						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<h2 className="truncate text-lg font-semibold">{dummyProject.name}</h2>
								<Badge className={statusClass[dummyProject.status] || "bg-gray-100 text-gray-800"}>{dummyProject.status}</Badge>
							</div>
							<p className="text-muted-foreground mt-1 text-sm">{dummyProject.framework}</p>
							<p className="text-muted-foreground text-xs">Updated {dummyProject.updatedAt}</p>
						</div>
					</div>
				</div>

				<div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
					<Card>
						<CardHeader>
							<CardTitle>Project Overview</CardTitle>
							<CardDescription>Informasi umum project</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="bg-muted/30 rounded-lg border p-4">
									<p className="text-muted-foreground text-xs uppercase tracking-wide">GitHub</p>
									<a href={dummyProject.github} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 break-all text-sm font-medium text-blue-600 hover:underline">
										<ExternalLink className="h-4 w-4" />
										{dummyProject.github}
									</a>
								</div>

								<div className="bg-muted/30 rounded-lg border p-4">
									<p className="text-muted-foreground text-xs uppercase tracking-wide">Demo</p>
									<a href={dummyProject.demo} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 break-all text-sm font-medium text-blue-600 hover:underline">
										<ExternalLink className="h-4 w-4" />
										{dummyProject.demo}
									</a>
								</div>
							</div>

							<div className="bg-muted/30 rounded-lg border p-4">
								<p className="text-muted-foreground text-xs uppercase tracking-wide">Description</p>
								<p className="mt-1 text-sm leading-6">{dummyProject.description}</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Environment Summary</CardTitle>
							<CardDescription>Group env per environment</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{envGroups.map((group) => (
								<div key={group.title} className="rounded-xl border p-4">
									<div className="flex items-start justify-between gap-3">
										<div>
											<h3 className="font-semibold">{group.title}</h3>
											<p className="text-muted-foreground mt-1 text-sm">{group.description}</p>
										</div>
										<Badge variant="secondary">{group.items.length} vars</Badge>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-semibold">Environment Variables</h2>
							<p className="text-muted-foreground text-sm">Dummy env sections for detail page</p>
						</div>
					</div>

					{envGroups.map((group) => (
						<Card key={group.title}>
							<CardHeader>
								<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
									<div>
										<CardTitle>{group.title}</CardTitle>
										<CardDescription>{group.description}</CardDescription>
									</div>
									<div className="flex gap-2">
										<Button size="sm" variant="outline" className="opacity-60" disabled>
											<Plus className="mr-2 h-4 w-4" />
											Add Variable
										</Button>
										<Button size="sm" variant="outline" className="opacity-60" disabled>
											<Pencil className="mr-2 h-4 w-4" />
											Edit Group
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="overflow-hidden rounded-lg border">
									<table className="w-full text-sm">
										<thead className="bg-muted/50">
											<tr>
												<th className="px-4 py-3 text-left font-medium">No</th>
												<th className="px-4 py-3 text-left font-medium">Key</th>
												<th className="px-4 py-3 text-left font-medium">Value</th>
												<th className="px-4 py-3 text-left font-medium">Type</th>
												<th className="px-4 py-3 text-right font-medium">Actions</th>
											</tr>
										</thead>
										<tbody>
											{group.items.map((item, index) => (
												<tr key={item.key} className="border-t">
													<td className="px-4 py-4 font-medium">{index + 1}</td>
													<td className="px-4 py-4">
														<span className="font-mono text-sm font-semibold">{item.key}</span>
													</td>
													<td className="px-4 py-4">
														<div className="flex items-center gap-2">
															<span className="truncate font-mono text-sm">{item.value}</span>
															<Button size="icon" variant="ghost" className="h-8 w-8 opacity-60" disabled>
																<Copy className="h-4 w-4" />
															</Button>
														</div>
													</td>
													<td className="px-4 py-4">
														<Badge variant={item.type === "Secret" ? "destructive" : "secondary"}>{item.type}</Badge>
													</td>
													<td className="px-4 py-4">
														<div className="flex justify-end gap-2">
															<Button size="sm" variant="outline" className="opacity-60" disabled>
																<Eye className="mr-2 h-4 w-4" />
																Show
															</Button>
															<Button size="sm" variant="outline" className="opacity-60" disabled>
																<EyeOff className="mr-2 h-4 w-4" />
																Hide
															</Button>
															<Button size="sm" variant="outline" className="opacity-60" disabled>
																<Pencil className="mr-2 h-4 w-4" />
																Edit
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
					))}
				</div>
			</div>
		</AdminLayout>
	);
}
