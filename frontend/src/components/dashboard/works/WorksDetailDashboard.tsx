import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, ExternalLink, AlertCircle, Github } from "lucide-react";
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
				const response = await api.get(`/projects/${id}`);
				setProject(response.data);
			} catch (error) {
				console.error("Failed to fetch project detail", error);
			} finally {
				setLoading(false);
			}
		};
		fetchProject();
	}, [id]);

	const getStatusVariant = (status: string) => {
		switch (status.toLowerCase()) {
			case "production":
				return { className: "bg-green-600 text-white" };
			case "preview":
				return { className: "bg-yellow-600 text-white" };
			case "archived":
				return { className: "bg-gray-600 text-white" };
			default:
				return { className: "bg-gray-600 text-white" };
		}
	};

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
			<div className="p-6">
				<div className="rounded-lg border border-red-200 bg-red-50">
					<div className="p-12 text-center">
						<AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
						<p className="mb-2 text-lg font-semibold text-red-900">Project Not Found</p>
						<p className="mb-6 text-sm text-red-700">The project you're looking for doesn't exist.</p>
						<Button asChild variant="outline" size="sm">
							<Link to="/admin/project">
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
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="mb-2 flex items-center gap-3">
						<h1 className="text-3xl font-semibold">{project.name}</h1>
						<Badge className={getStatusVariant(project.status).className}>{project.status}</Badge>
					</div>
					<div className="flex items-center gap-4 text-sm text-gray-600">
						<span>
							{project.startDate ? new Date(project.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "?"} — {project.endDate ? new Date(project.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present"}
						</span>
						{project.stack && project.stack.length > 0 && (
							<>
								<span className="text-gray-400">•</span>
								<div className="flex items-center gap-2">
									{project.stack.slice(0, 3).map((s, i) => (
										<span key={i} className="rounded bg-gray-100 px-2 py-0.5 text-xs">
											{s}
										</span>
									))}
									{project.stack.length > 3 && <span className="text-xs text-gray-500">+{project.stack.length - 3} more</span>}
								</div>
							</>
						)}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button asChild variant="outline" size="sm" className="border-gray-300">
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

			{/* Main Content */}
			<div className="overflow-hidden rounded-lg border bg-white shadow-sm">
				<div className="space-y-8 p-8">
					{/* Images Grid */}
					{project.images && project.images.length > 0 && (
						<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
							{project.images.map((url, idx) => (
								<div key={idx} className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50 transition-colors hover:border-gray-300">
									<img src={url} alt={`${project.name} ${idx + 1}`} className="h-full w-full object-cover" />
								</div>
							))}
						</div>
					)}

					{/* Description */}
					{project.description && (
						<div className="prose prose-sm max-w-none">
							<p className="leading-relaxed whitespace-pre-wrap text-gray-700">{project.description}</p>
						</div>
					)}

					{/* Links & Tech Stack */}
					<div className="flex flex-wrap items-center gap-6 border-t pt-6">
						{project.link_github && (
							<a href={project.link_github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-gray-900">
								<Github className="h-4 w-4" />
								<span className="font-medium">GitHub</span>
							</a>
						)}
						{project.link_demo && (
							<a href={project.link_demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-gray-900">
								<ExternalLink className="h-4 w-4" />
								<span className="font-medium">Live Demo</span>
							</a>
						)}
						{project.stack && project.stack.length > 0 && (
							<>
								<span className="text-gray-300">|</span>
								<div className="flex flex-wrap items-center gap-2">
									{project.stack.map((s, i) => (
										<span key={i} className="rounded border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
											{s}
										</span>
									))}
								</div>
							</>
						)}
					</div>

					{/* Environment Variables */}
					{project.env && (
						<div className="border-t pt-6">
							<pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-xs text-gray-800">{project.env}</pre>
						</div>
					)}

					{/* Footer */}
					<div className="border-t pt-6 text-xs text-gray-500">Last updated {new Date(project.updatedAt).toLocaleString()}</div>
				</div>
			</div>
		</div>
	);
}
