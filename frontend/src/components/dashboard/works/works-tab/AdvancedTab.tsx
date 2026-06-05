import { Info } from "lucide-react";

interface AdvancedTabProps {
	formData: {
		env: string;
	};
	handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function AdvancedTab({ formData, handleChange }: AdvancedTabProps) {
	return (
		<div className="space-y-6">
			<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
				<div className="border-b px-6 py-4">
					<h2 className="text-base font-semibold">Environment Variables</h2>
					<p className="text-muted-foreground mt-1 text-sm">Optional configuration for development setup</p>
				</div>
				<div className="p-6">
					<div className="space-y-4">
						<div className="bg-muted/50 flex items-start gap-3 rounded-lg border p-4">
							<Info className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
							<div className="space-y-1">
								<p className="text-sm font-medium">Environment Configuration</p>
								<p className="text-muted-foreground text-xs leading-relaxed">Add environment variables in KEY=VALUE format. Each variable should be on a new line. These will be stored securely and only visible to authenticated admins.</p>
							</div>
						</div>

						<div className="space-y-2">
							<label htmlFor="env" className="text-sm font-medium">
								Environment Variables
							</label>
							<textarea
								id="env"
								name="env"
								value={formData.env}
								onChange={handleChange}
								placeholder="DATABASE_URL=mongodb://localhost:27017/mydb&#10;API_KEY=your_api_key_here&#10;PORT=3000&#10;NODE_ENV=development"
								className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-64 w-full rounded-md border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							/>
							<p className="text-muted-foreground text-xs">Tip: Use KEY=VALUE format, one per line</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
