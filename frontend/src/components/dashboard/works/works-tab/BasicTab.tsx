interface FormData {
	name: string;
	description: string;
	images: string[];
	stack: string[];
	category: string;
	startDate: string;
	endDate: string;
	link_github: string;
	link_demo: string;
	status: string;
	env: string;
}

interface BasicTabProps {
	formData: FormData;
	handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
	setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function BasicTab({ formData, handleChange, setFormData }: BasicTabProps) {
	return (
		<div className="space-y-6">
			<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
				<div className="border-b px-6 py-4">
					<h2 className="text-base font-semibold">Project Details</h2>
					<p className="text-muted-foreground mt-1 text-sm">Basic information about your project</p>
				</div>
				<div className="space-y-5 p-6">
					<div className="space-y-2">
						<label htmlFor="name" className="text-sm font-medium">
							Project Name <span className="text-destructive">*</span>
						</label>
						<input
							id="name"
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Enter project name"
							className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							required
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="description" className="text-sm font-medium">
							Description <span className="text-destructive">*</span>
						</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							placeholder="Project description (supports markdown)"
							className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-32 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							required
						/>
					</div>

					<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<label htmlFor="status" className="text-sm font-medium">
								Status <span className="text-destructive">*</span>
							</label>
							<select id="status" name="status" value={formData.status} onChange={handleChange} className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" required>
								<option value="Production">Production</option>
								<option value="Preview">Preview</option>
								<option value="Archived">Archived</option>
							</select>
						</div>
						<div className="space-y-2">
							<label htmlFor="category" className="text-sm font-medium">
								Category
							</label>
							<select id="category" name="category" value={formData.category} onChange={handleChange} className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
								<option value="">Select category</option>
								<option value="Education">Education</option>
								<option value="Business">Business</option>
								<option value="Landing Page">Landing Page</option>
								<option value="Dashboard">Dashboard</option>
							</select>
						</div>
					</div>

					<div className="space-y-2">
						<label htmlFor="stack" className="text-sm font-medium">
							Tech Stack <span className="text-destructive">*</span>
						</label>
						<input
							id="stack"
							type="text"
							name="stack"
							value={formData.stack.join(", ")}
							onChange={(e) => {
								const val = e.target.value;
								setFormData((prev) => ({
									...prev,
									stack: val.split(",").map((s) => s.trim()),
								}));
							}}
							placeholder="React, TypeScript, Node.js"
							className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							required
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
