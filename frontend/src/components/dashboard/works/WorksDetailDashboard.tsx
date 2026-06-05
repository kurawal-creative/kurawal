import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, AlertCircle, Github, Globe } from "lucide-react";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
	id: string;
	name: string;
	images: string[];
	stack: string[];
	startDate: string | null;
	endDate: string | null;
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
				const response = await api.get(`/works/${id}`);
				setProject(response.data);
			} catch (error) {
				console.error("Failed to fetch project detail", error);
			} finally {
				setLoading(false);
			}
		};
		fetchProject();
	}, [id]);

	if (loading) {
		return (
			<div className="space-y-6 p-6">
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-64" />
					<div className="flex gap-2">
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-24" />
					</div>
				</div>
				<div className="rounded-lg border bg-white shadow-sm">
					<div className="space-y-4 p-8">
						<Skeleton className="h-64 w-full rounded" />
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-24 w-full" />
					</div>
				</div>
			</div>
		);
	}

	if (!project) {
		return (
			<div>
				<div className="rounded-lg border border-red-200 bg-red-50">
					<div className="p-12 text-center">
						<AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
						<p className="mb-2 text-lg font-semibold text-red-900">Project Not Found</p>
						<p className="mb-6 text-sm text-red-700">The project you're looking for doesn't exist.</p>
						<Button asChild variant="outline" size="sm">
							<Link to="/dashboard/works">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Projects
							</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<div className="flex flex-wrap items-center gap-2">
						<h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>

						<Badge variant="outline" className={project.status.toLowerCase() === "production" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600" : project.status.toLowerCase() === "preview" ? "border-amber-500/20 bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}>
							{project.status}
						</Badge>
					</div>

					<div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs">
						<span>
							{project.startDate
								? new Date(project.startDate).toLocaleDateString("en-US", {
										month: "short",
										year: "numeric",
									})
								: "-"}
						</span>

						<span>•</span>

						<span>
							{project.endDate
								? new Date(project.endDate).toLocaleDateString("en-US", {
										month: "short",
										year: "numeric",
									})
								: "Present"}
						</span>

						<span>•</span>

						<span>
							Updated{" "}
							{new Date(project.updatedAt).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</span>
					</div>
				</div>

				<div className="flex gap-2">
					<Button asChild variant="outline" size="sm">
						<Link to="/dashboard/works">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back
						</Link>
					</Button>

					<Button asChild size="sm">
						<Link to={`/dashboard/works/${id}/edit`}>
							<Pencil className="mr-2 h-4 w-4" />
							Edit
						</Link>
					</Button>
				</div>
			</div>

			{/* Content */}
			<div className="grid gap-4 lg:grid-cols-[1fr_240px]">
				{/* Main */}
				<div className="space-y-4">
					{/* Gallery */}
					{project.images?.length > 0 && (
						<div className="bg-card overflow-hidden rounded-xl border">
							<img src={project.images[0]} alt={project.name} className="aspect-video w-full object-cover" />

							{project.images.length > 1 && (
								<div className="grid grid-cols-4 gap-2 border-t p-3">
									{project.images.slice(1).map((image, index) => (
										<div key={index} className="overflow-hidden rounded-md border">
											<img src={image} alt="" className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105" />
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* Description */}
					<div className="bg-card rounded-xl border">
						<div className="border-b px-4 py-3">
							<h2 className="text-sm font-semibold">Overview</h2>
						</div>

						<div className="p-4">
							<p className="text-muted-foreground text-sm leading-6 whitespace-pre-wrap">{project.description || "No description available."}</p>
						</div>
					</div>

					{/* Environment */}
					{project.env && (
						<div className="bg-card rounded-xl border">
							<div className="border-b px-4 py-3">
								<h2 className="text-sm font-semibold">Environment</h2>
							</div>

							<div className="p-4">
								<pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs">{project.env}</pre>
							</div>
						</div>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-4">
					{/* Stack */}
					<div className="bg-card rounded-xl border">
						<div className="border-b px-4 py-3">
							<h2 className="text-sm font-semibold">Technology Stack</h2>
						</div>

						<div className="flex flex-wrap gap-2 p-4">
							{project.stack?.length ? (
								project.stack.map((tech, index) => (
									<Badge key={index} variant="secondary">
										{tech}
									</Badge>
								))
							) : (
								<p className="text-muted-foreground text-sm">No technologies specified.</p>
							)}
						</div>
					</div>

					{/* Project Info */}
					<div className="bg-card rounded-xl border">
						<div className="border-b px-4 py-3">
							<h2 className="text-sm font-semibold">Project Information</h2>
						</div>

						<div className="grid gap-3 p-4 text-sm">
							<div className="grid grid-cols-2">
								<div>
									<p className="text-muted-foreground text-xs">Created</p>
									<p className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</p>
								</div>

								<div>
									<p className="text-muted-foreground text-xs">Last Updated</p>
									<p className="font-medium">{new Date(project.updatedAt).toLocaleDateString()}</p>
								</div>
							</div>

							<div>
								<p className="text-muted-foreground text-xs">Status</p>
								<p className="font-medium">{project.status}</p>
							</div>
						</div>
					</div>

					{/* Links */}
					<div className="bg-card rounded-xl border">
						<div className="border-b px-4 py-3">
							<h2 className="text-sm font-semibold">Resources</h2>
						</div>

						<div className="flex flex-wrap gap-2 p-4">
							{project.link_github && (
								<Button asChild size="sm">
									<a href={project.link_github} target="_blank" rel="noopener noreferrer" title="GitHub Repository" className="flex items-center gap-1">
										<Github className="h-4 w-4" />
										GitHub
									</a>
								</Button>
							)}

							{project.link_demo && (
								<Button asChild variant="outline" size="sm">
									<a href={project.link_demo} target="_blank" rel="noopener noreferrer" title="Project Website" className="flex items-center gap-1">
										<Globe className="h-4 w-4" />
										Website
									</a>
								</Button>
							)}

							{!project.link_demo && !project.link_github && <p className="text-muted-foreground text-sm">No resources available.</p>}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
