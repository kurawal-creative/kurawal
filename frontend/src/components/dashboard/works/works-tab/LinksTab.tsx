import { Github, Globe } from "lucide-react";

interface LinksTabProps {
	formData: {
		startDate: string;
		endDate: string;
		link_github: string;
		link_demo: string;
	};
	handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function LinksTab({ formData, handleChange }: LinksTabProps) {
	return (
		<div className="space-y-6">
			<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
				<div className="border-b px-6 py-4">
					<h2 className="text-base font-semibold">Timeline</h2>
					<p className="text-muted-foreground mt-1 text-sm">Define the project timeline</p>
				</div>
				<div className="p-6">
					<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<label htmlFor="startDate" className="text-sm font-medium">
								Start Date <span className="text-destructive">*</span>
							</label>
							<input
								id="startDate"
								type="date"
								name="startDate"
								value={formData.startDate}
								onChange={handleChange}
								className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								required
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="endDate" className="text-sm font-medium">
								End Date <span className="text-destructive">*</span>
							</label>
							<input
								id="endDate"
								type="date"
								name="endDate"
								value={formData.endDate}
								onChange={handleChange}
								className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								required
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
				<div className="border-b px-6 py-4">
					<h2 className="text-base font-semibold">Project Links</h2>
					<p className="text-muted-foreground mt-1 text-sm">Add external links to your project</p>
				</div>
				<div className="p-6">
					<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<label htmlFor="link_github" className="flex items-center gap-2 text-sm font-medium">
								<Github className="h-4 w-4" />
								GitHub Repository
							</label>
							<input
								id="link_github"
								type="url"
								name="link_github"
								value={formData.link_github}
								onChange={handleChange}
								placeholder="https://github.com/username/repo"
								className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="link_demo" className="flex items-center gap-2 text-sm font-medium">
								<Globe className="h-4 w-4" />
								Live Demo URL
							</label>
							<input
								id="link_demo"
								type="url"
								name="link_demo"
								value={formData.link_demo}
								onChange={handleChange}
								placeholder="https://example.com"
								className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
