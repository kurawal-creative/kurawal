import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TagInput, type Tag as TagOption } from "@/components/tag-input";
import { generateTagColor } from "@/utils/tagColors";

interface SettingsTabProps {
	formData: {
		title: string;
		description: string;
		status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	};
	thumbnailPreview: string;
	selectedTagOptions: TagOption<string>[];
	allTagOptions: TagOption<string>[];
	onDescriptionChange: (description: string) => void;
	onTagsChange: (tags: TagOption<string>[]) => void;
}

export function SettingsTab({ formData, thumbnailPreview, selectedTagOptions, allTagOptions, onDescriptionChange, onTagsChange }: SettingsTabProps) {
	return (
		<div className="w-full">
			<div className="mx-auto py-6">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{/* Left Column - Form Fields */}
					<div className="space-y-6 rounded-xl border p-6">
						<div>
							<h3 className="text-lg font-semibold">Post Details</h3>
							<p className="text-xs text-muted-foreground mt-1">Configure your post settings</p>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor="description" className="text-sm font-medium">
								Description
							</Label>
							<p className="text-xs text-muted-foreground">Brief summary for previews</p>
							<Textarea id="description" value={formData.description} onChange={(e) => onDescriptionChange(e.target.value)} placeholder="Write a brief summary..." rows={3} className="resize-none text-sm" />
						</div>

						{/* Tags */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">Tags *</Label>
							<p className="text-xs text-muted-foreground">Add relevant tags</p>
							<TagInput tags={selectedTagOptions} setTags={onTagsChange} allTags={allTagOptions} placeholder="Search tags..." />
						</div>
					</div>

					{/* Right Column - Preview Card */}
					<div className="space-y-4 rounded-xl border p-6">
						<div>
							<h3 className="text-lg font-semibold">Preview</h3>
							<p className="text-xs text-muted-foreground mt-1">How your post will appear in the blog list</p>
						</div>

						{/* Preview Card matching BlogsCollection style */}
						<div className="flex flex-col border border-dashed rounded-lg overflow-hidden">
							<div className="bg-muted relative w-full overflow-hidden">
								{thumbnailPreview ? (
									<img src={thumbnailPreview} alt="Preview" className="h-56 w-full object-cover" />
								) : (
									<div className="flex h-56 w-full items-center justify-center">
										<ImageIcon className="h-12 w-12 text-muted-foreground/30" />
									</div>
								)}
								{formData.status === "PUBLISHED" && (
									<Badge variant="default" className="absolute left-4 top-4">
										Published
									</Badge>
								)}
								{formData.status === "DRAFT" && (
									<Badge variant="secondary" className="absolute left-4 top-4">
										Draft
									</Badge>
								)}
							</div>
							<div className="space-y-2 p-4">
								<p className="text-muted-foreground text-xs">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
								<h3 className="line-clamp-2 text-lg font-semibold">{formData.title || "Your post title will appear here"}</h3>
								<p className="text-muted-foreground line-clamp-2 text-sm">{formData.description || "Your description will appear here..."}</p>
							</div>
							<div className="w-full px-4 pb-4">
								<button type="button" disabled className="group inline-flex cursor-not-allowed items-center gap-1 rounded-full border border-neutral-300 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-800 opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100">
									<span>Read More</span>
									<ArrowRight size={14} />
								</button>
							</div>
						</div>

						{/* Tags Preview */}
						{selectedTagOptions.length > 0 && (
							<div className="space-y-2">
								<Label className="text-sm font-medium">Selected Tags</Label>
								<div className="flex flex-wrap gap-2">
									{selectedTagOptions.map((tag) => (
										<Badge key={tag.value} className={generateTagColor(tag.label)}>
											{tag.label}
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
