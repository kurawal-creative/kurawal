import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Eye, Pencil, Trash2, Plus, Search, Filter, ArrowUpDown, MoreHorizontal } from "lucide-react";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await api.get("/projects");
				const projectsData = Array.isArray(response.data) ? response.data : response.data.data;
				setProjects(Array.isArray(projectsData) ? projectsData : []);
			} catch (error) {
				console.error("Failed to fetch projects", error);
			} finally {
				setLoading(false);
			}
		};
		fetchProjects();
	}, []);

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this project?")) return;
		try {
			await api.delete(`/projects/${id}`);
			setProjects(projects.filter((p) => p.id !== id));
		} catch (error) {
			alert("Failed to delete project");
		}
	};

	const getStatusVariant = (status: string) => {
		switch (status.toLowerCase()) {
			case "production":
				return {
					variant: "secondary" as const,
					className: "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black",
				};
			case "preview":
				return {
					variant: "secondary" as const,
					className: "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100",
				};
			case "archived":
				return {
					variant: "outline" as const,
					className: "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400",
				};
			default:
				return {
					variant: "outline" as const,
					className: "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400",
				};
		}
	};

	const filteredProjects = projects.filter((p) => {
		const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
		return matchesSearch && matchesStatus;
	});

	const getStatusCounts = () => {
		const production = projects.filter((p) => p.status.toLowerCase() === "production").length;
		const preview = projects.filter((p) => p.status.toLowerCase() === "preview").length;
		const archived = projects.filter((p) => p.status.toLowerCase() === "archived").length;
		return { all: projects.length, production, preview, archived };
	};

	const counts = getStatusCounts();

	if (loading) {
		return (
			<div className="space-y-4 p-6">
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-10 w-32" />
				</div>
				<Skeleton className="h-10 w-full max-w-md" />
				<div className="rounded-lg border">
					<div className="space-y-3 p-6">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="flex items-center gap-4">
								<Skeleton className="h-12 w-12 rounded" />
								<Skeleton className="h-4 flex-1" />
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-24" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-semibold">Projects</h1>
					<p className="text-muted-foreground mt-1 text-sm">Manage your project portfolio</p>
				</div>
				<div className="flex items-center">
					<Button asChild size="sm">
						<Link to="/dashboard/works/create">
							<Plus className="mr-2 h-4 w-4" />
							Add Project
						</Link>
					</Button>
				</div>
			</div>

			<Tabs defaultValue="all" onValueChange={setStatusFilter} className="space-y-2">
				<TabsList className="bg-gray-100">
					<TabsTrigger value="all" className="data-[state=active]:bg-white">
						All <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs">{counts.all}</span>
					</TabsTrigger>
					<TabsTrigger value="production" className="data-[state=active]:bg-white">
						Production <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs">{counts.production}</span>
					</TabsTrigger>
					<TabsTrigger value="preview" className="data-[state=active]:bg-white">
						Preview <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs">{counts.preview}</span>
					</TabsTrigger>
					<TabsTrigger value="archived" className="data-[state=active]:bg-white">
						Archived <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs">{counts.archived}</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value={statusFilter} className="space-y-4">
					<div className="flex items-center gap-2">
						<div className="relative max-w-md flex-1">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<Input type="text" placeholder="Search Project by Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-white pl-9" />
						</div>
						<Button variant="outline" size="sm" className="border-gray-300">
							<Filter className="mr-2 h-4 w-4" />
							Filter
						</Button>
						<Button variant="outline" size="sm" className="border-gray-300">
							<ArrowUpDown className="mr-2 h-4 w-4" />
							Sort
						</Button>
					</div>

					<div className="overflow-hidden rounded-xl border bg-white shadow-sm">
						{filteredProjects.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
									<Search className="h-8 w-8 text-gray-400" />
								</div>
								<p className="text-muted-foreground text-sm font-medium">No projects found.</p>
								<p className="text-muted-foreground mt-1 text-xs">Try adjusting your search or filters</p>
								{searchQuery === "" && (
									<Button asChild variant="outline" size="sm" className="mt-4">
										<Link to="/admin/project/create">
											<Plus className="mr-2 h-4 w-4" />
											Create Your First Project
										</Link>
									</Button>
								)}
							</div>
						) : (
							<Table className="rounded-lg">
								<TableHeader className="rounded-lg">
									<TableRow className="rounded-lg bg-gray-50 hover:bg-gray-50">
										<TableHead className="w-12 font-semibold text-gray-700">No</TableHead>
										<TableHead className="font-semibold text-gray-700">Name</TableHead>
										<TableHead className="font-semibold text-gray-700">Links</TableHead>
										<TableHead className="font-semibold text-gray-700">Date</TableHead>
										<TableHead className="font-semibold text-gray-700">Status</TableHead>
										<TableHead className="w-16 text-center font-semibold text-gray-700">Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody className="rounded-lg">
									{filteredProjects.map((p, index) => (
										<TableRow key={p.id} className="hover:bg-gray-50">
											<TableCell className="text-muted-foreground font-medium">{index + 1}</TableCell>
											<TableCell>
												<div className="flex items-center gap-3">
													{p.images && p.images.length > 0 ? (
														<div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border-2 border-gray-200">
															<img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
														</div>
													) : (
														<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
															<span className="text-xs font-semibold text-gray-500">N/A</span>
														</div>
													)}
													<div className="flex flex-col">
														<span className="font-medium text-gray-900">{p.name}</span>
														{(p.link_github || p.link_demo) && <span className="text-xs text-gray-500">{p.link_github ? new URL(p.link_github).hostname : p.link_demo ? new URL(p.link_demo).hostname : ""}</span>}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													{p.link_github && (
														<a href={p.link_github} target="_blank" rel="noopener noreferrer" className="rounded-md bg-gray-100 p-1.5 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900" title="GitHub">
															<svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
																<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
															</svg>
														</a>
													)}
													{p.link_demo && (
														<a href={p.link_demo} target="_blank" rel="noopener noreferrer" className="rounded-md bg-gray-100 p-1.5 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900" title="Demo">
															<ExternalLink className="h-4 w-4" />
														</a>
													)}
													{!p.link_github && !p.link_demo && <span className="text-muted-foreground text-xs">-</span>}
												</div>
											</TableCell>
											<TableCell className="text-sm text-gray-600">{new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
											<TableCell>
												<Badge className={getStatusVariant(p.status).className}>{p.status}</Badge>
											</TableCell>
											<TableCell className="flex items-center justify-center">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
															<MoreHorizontal className="h-4 w-4" />
															<span className="sr-only">More actions</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-48">
														<DropdownMenuItem asChild>
															<Link to={`/dashboard/works/${p.id}`} className="cursor-pointer">
																<Eye className="mr-2 h-4 w-4" />
																View Details
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem asChild>
															<Link to={`/dashboard/works/${p.id}/edit`} className="cursor-pointer">
																<Pencil className="mr-2 h-4 w-4" />
																Edit Project
															</Link>
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem variant="destructive" onClick={() => handleDelete(p.id)} className="cursor-pointer">
															<Trash2 className="mr-2 h-4 w-4" />
															Delete Project
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
