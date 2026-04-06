import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FolderGit2, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const envTypes = ["Public", "Secret"] as const;

const dummyGroups = [
	{
		id: 1,
		name: "Production",
		description: "Environment variables for production deployment",
	},
	{
		id: 2,
		name: "Preview",
		description: "Environment variables for preview deployments",
	},
];

const dummyVariables = [
	{
		id: 1,
		groupId: 1,
		key: "NEXT_PUBLIC_API_URL",
		value: "https://api.kurawal.dev",
		type: "Public",
	},
	{
		id: 2,
		groupId: 1,
		key: "DATABASE_URL",
		value: "postgresql://••••••••",
		type: "Secret",
	},
	{
		id: 3,
		groupId: 2,
		key: "NEXT_PUBLIC_API_URL",
		value: "https://preview-api.kurawal.dev",
		type: "Public",
	},
];

export default function AdminProjectCreatePage() {
	return (
		<AdminLayout>
			<div className="space-y-6 pb-8">
				<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<FolderGit2 className="text-muted-foreground h-6 w-6" />
							<h1 className="text-3xl font-bold tracking-tight">Create Project</h1>
						</div>
						<p className="text-muted-foreground max-w-2xl">
							Halaman create project dummy. Di sini nanti bisa menambahkan project baru beserta environment variables-nya seperti ala Vercel.
						</p>

						<div className="flex flex-wrap gap-2">
							<Button asChild variant="outline">
								<Link to="/admin/project">
									<ArrowLeft className="mr-2 h-4 w-4" />
									Back
								</Link>
							</Button>
							<Button className="opacity-60" disabled>
								<Plus className="mr-2 h-4 w-4" />
								Save Project
							</Button>
						</div>
					</div>

					<Card className="w-full max-w-sm">
						<CardHeader>
							<CardTitle>Preview</CardTitle>
							<CardDescription>Tampilan ringkas project baru</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<img src="https://picsum.photos/200/300?random=10" alt="Project preview" className="h-40 w-full rounded-lg object-cover" />
							<div className="space-y-1">
								<p className="text-lg font-semibold">New Project</p>
								<p className="text-muted-foreground text-sm">Production • Next.js</p>
							</div>
							<Badge variant="secondary">Draft</Badge>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
					<Card>
						<CardHeader>
							<CardTitle>Project Information</CardTitle>
							<CardDescription>Form dummy untuk data utama project</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2 md:col-span-2">
									<Label htmlFor="name">Project Name</Label>
									<Input id="name" placeholder="e.g. Kurawal Portfolio" />
								</div>

								<div className="space-y-2 md:col-span-2">
									<Label htmlFor="description">Description</Label>
									<Textarea id="description" placeholder="Short description about this project" className="min-h-28" />
								</div>

								<div className="space-y-2">
									<Label htmlFor="github">GitHub URL</Label>
									<Input id="github" placeholder="https://github.com/username/repo" />
								</div>

								<div className="space-y-2">
									<Label htmlFor="demo">Demo URL</Label>
									<Input id="demo" placeholder="https://project-demo.com" />
								</div>

								<div className="space-y-2 md:col-span-2">
									<Label htmlFor="thumbnail">Thumbnail URL</Label>
									<Input id="thumbnail" placeholder="https://picsum.photos/200/300" />
								</div>

								<div className="space-y-2">
									<Label htmlFor="status">Status</Label>
									<Input id="status" placeholder="DRAFT / PUBLISHED / ARCHIVED" />
								</div>

								<div className="space-y-2">
									<Label htmlFor="framework">Framework</Label>
									<Input id="framework" placeholder="Next.js / Vite / React" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Environment Groups</CardTitle>
							<CardDescription>Buat env group untuk project ini</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{dummyGroups.map((group) => (
								<div key={group.id} className="rounded-xl border p-4">
									<div className="flex items-start justify-between gap-3">
										<div className="space-y-1">
											<h3 className="font-semibold">{group.name}</h3>
											<p className="text-muted-foreground text-sm">{group.description}</p>
										</div>
										<Button size="sm" variant="outline" className="opacity-60" disabled>
											Edit
										</Button>
									</div>
								</div>
							))}

							<Button variant="outline" className="w-full opacity-60" disabled>
								<Plus className="mr-2 h-4 w-4" />
								Add Env Group
							</Button>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Environment Variables</CardTitle>
						<CardDescription>Dummy env list yang nanti bisa diatur per group</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-hidden rounded-lg border">
							<table className="w-full text-sm">
								<thead className="bg-muted/50">
									<tr>
										<th className="px-4 py-3 text-left font-medium">No</th>
										<th className="px-4 py-3 text-left font-medium">Group</th>
										<th className="px-4 py-3 text-left font-medium">Key</th>
										<th className="px-4 py-3 text-left font-medium">Value</th>
										<th className="px-4 py-3 text-left font-medium">Type</th>
										<th className="px-4 py-3 text-right font-medium">Actions</th>
									</tr>
								</thead>
								<tbody>
									{dummyVariables.map((variable, index) => {
										const group = dummyGroups.find((g) => g.id === variable.groupId);

										return (
											<tr key={variable.id} className="border-t">
												<td className="px-4 py-4 font-medium">{index + 1}</td>
												<td className="px-4 py-4">{group?.name || "-"}</td>
												<td className="px-4 py-4">
													<span className="font-mono text-sm font-semibold">{variable.key}</span>
												</td>
												<td className="px-4 py-4">
													<span className="font-mono text-sm">{variable.value}</span>
												</td>
												<td className="px-4 py-4">
													<Badge variant={variable.type === "Secret" ? "destructive" : "secondary"}>{variable.type}</Badge>
												</td>
												<td className="px-4 py-4">
													<div className="flex justify-end gap-2">
														<Button size="sm" variant="outline" className="opacity-60" disabled>
															Edit
														</Button>
														<Button size="sm" variant="destructive" className="opacity-60" disabled>
															<Trash2 className="mr-2 h-4 w-4" />
															Delete
														</Button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						<div className="mt-4 flex flex-wrap gap-2">
							{envTypes.map((type) => (
								<Badge key={type} variant={type === "Secret" ? "destructive" : "secondary"}>
									{type}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</AdminLayout>
	);
}
