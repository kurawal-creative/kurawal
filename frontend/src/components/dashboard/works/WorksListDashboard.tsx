import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2, Plus, Search, Filter, ArrowUpDown, MoreHorizontal, Github, Globe, FolderKanban, Rocket, FlaskConical, Archive } from "lucide-react";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Project {
	id: string;
	name: string;
	images: string[];
	link_github: string;
	link_demo: string;
	status: string;
	category: string;
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
				const response = await api.get("/works");
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
			await api.delete(`/works/${id}`);
			setProjects(projects.filter((p) => p.id !== id));
		} catch {
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
		<div className="space-y-5">
			{/* Header */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Our Works</h1>
					<p className="text-muted-foreground mt-1 text-sm">Manage and organize company projects, case studies, and client works.</p>
				</div>

				<Button asChild>
					<Link to="/dashboard/works/create">
						<Plus className="mr-2 h-4 w-4 " />
						New Project
					</Link>
				</Button>
			</div>

			{/* Stats */}
			<div className="grid gap-3 md:grid-cols-4">
				<div className="bg-card flex items-center justify-between rounded-xl border p-4">
					<div>
						<p className="text-muted-foreground text-xs font-medium">Total Projects</p>
						<p className="mt-1 text-2xl font-bold">{counts.all}</p>
					</div>

					<div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-lg">
						<FolderKanban className="text-primary h-5 w-5" />
					</div>
				</div>

				<div className="bg-card flex items-center justify-between rounded-xl border p-4">
					<div>
						<p className="text-muted-foreground text-xs font-medium">Production</p>
						<p className="mt-1 text-2xl font-bold">{counts.production}</p>
					</div>

					<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
						<Rocket className="h-5 w-5 text-emerald-600" />
					</div>
				</div>

				<div className="bg-card flex items-center justify-between rounded-xl border p-4">
					<div>
						<p className="text-muted-foreground text-xs font-medium">Preview</p>
						<p className="mt-1 text-2xl font-bold">{counts.preview}</p>
					</div>

					<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/10">
						<FlaskConical className="h-5 w-5 text-amber-600" />
					</div>
				</div>

				<div className="bg-card flex items-center justify-between rounded-xl border p-4">
					<div>
						<p className="text-muted-foreground text-xs font-medium">Archived</p>
						<p className="mt-1 text-2xl font-bold">{counts.archived}</p>
					</div>

					<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-500/10">
						<Archive className="h-5 w-5 text-slate-600" />
					</div>
				</div>
			</div>

			<div className="bg-card rounded-xl border">
				{/* Toolbar */}
				<div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
					<Tabs defaultValue="all" onValueChange={setStatusFilter}>
						<TabsList>
							<TabsTrigger value="all">All ({counts.all})</TabsTrigger>
							<TabsTrigger value="production">Production ({counts.production})</TabsTrigger>
							<TabsTrigger value="preview">Preview ({counts.preview})</TabsTrigger>
							<TabsTrigger value="archived">Archived ({counts.archived})</TabsTrigger>
						</TabsList>
					</Tabs>

					<div className="flex gap-2">
						<div className="relative w-full lg:w-72">
							<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
							<Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search projects..." className="h-9 pl-9" />
						</div>

						<Button variant="outline" size="icon" className="h-9 w-10">
							<Filter className="h-4 w-4" />
						</Button>

						<Button variant="outline" size="icon" className="h-9 w-10">
							<ArrowUpDown className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Table */}
				{filteredProjects.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-10">
						<div className="bg-muted/50 mb-3 flex h-14 w-14 items-center justify-center rounded-full">
							<FolderKanban className="text-muted-foreground h-7 w-7" />
						</div>

						<p className="text-sm font-medium">{statusFilter === "all" ? "No projects found" : statusFilter === "production" ? "No production projects" : statusFilter === "preview" ? "No preview projects" : "No archived projects"}</p>

						<p className="text-muted-foreground mt-1 text-xs">Try changing the filter or create a new project.</p>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/30 hover:bg-muted/30">
								<TableHead className="w-14">No.</TableHead>
								<TableHead>Project</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Resources</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="w-14">Actions</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{filteredProjects.map((p, index) => (
								<TableRow key={p.id} className="group">
									<TableCell className="text-muted-foreground">{index + 1}</TableCell>

									<TableCell>
										<div className="flex items-center gap-3">
											<div className="bg-muted h-11 w-11 overflow-hidden rounded-lg border">{p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" /> : null}</div>

											<div>
												<p className="font-medium">{p.name}</p>

												<p className="text-muted-foreground text-xs">{new Date(p.createdAt).toLocaleDateString()}</p>
											</div>
										</div>
									</TableCell>

									<TableCell>
										{p.category ? (
											<Badge variant="outline" className="text-xs">
												{p.category}
											</Badge>
										) : (
											<span className="text-muted-foreground text-xs">-</span>
										)}
									</TableCell>

									<TableCell>
										<div className="flex items-center gap-2">
											{p.link_github && (
												<a href={p.link_github} target="_blank" rel="noreferrer" className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md border transition-colors">
													<Github className="h-4 w-4" />
												</a>
											)}

											{p.link_demo && (
												<a href={p.link_demo} target="_blank" rel="noreferrer" className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md border transition-colors">
													<Globe className="h-4 w-4" />
												</a>
											)}
										</div>
									</TableCell>

									<TableCell className="text-muted-foreground">
										{new Date(p.createdAt).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</TableCell>

									<TableCell>
										<Badge className={getStatusVariant(p.status).className}>{p.status}</Badge>
									</TableCell>

									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>

											<DropdownMenuContent align="end">
												<DropdownMenuItem asChild>
													<Link to={`/dashboard/works/${p.id}`}>
														<Eye className="mr-2 h-4 w-4" />
														View
													</Link>
												</DropdownMenuItem>

												<DropdownMenuItem asChild>
													<Link to={`/dashboard/works/${p.id}/edit`}>
														<Pencil className="mr-2 h-4 w-4" />
														Edit
													</Link>
												</DropdownMenuItem>

												<DropdownMenuSeparator />

												<DropdownMenuItem variant="destructive" onClick={() => handleDelete(p.id)}>
													<Trash2 className="mr-2 h-4 w-4" />
													Delete
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
		</div>
	);
}
