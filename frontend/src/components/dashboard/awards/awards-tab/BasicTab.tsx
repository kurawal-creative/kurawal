import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput, type Tag as TagOption } from "@/components/tag-input";

interface BasicTabProps {
	formData: {
		title: string;
		tagIds: string[];
		date: string;
		institution: string;
		location: string;
		description: string;
	};
	tags: { id: string; name: string }[];
	selectedTagOptions: TagOption<string>[];
	handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	setFormData: React.Dispatch<
		React.SetStateAction<{
			title: string;
			tagIds: string[];
			date: string;
			institution: string;
			location: string;
			description: string;
			images: string[];
		}>
	>;
	setSelectedTagOptions: React.Dispatch<React.SetStateAction<TagOption<string>[]>>;
}

export default function BasicTab({ formData, tags, selectedTagOptions, handleChange, setFormData, setSelectedTagOptions }: BasicTabProps) {
	const allTagOptions: TagOption<string>[] = tags.map((t) => ({ label: t.name, value: t.id }));

	return (
		<div className="space-y-6">
			<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
				<div className="border-b px-6 py-4">
					<h2 className="text-base font-semibold">Award Details</h2>
					<p className="text-muted-foreground mt-1 text-sm">Information about your achievement or recognition</p>
				</div>

				<div className="space-y-5 p-6">
					<div className="space-y-2">
						<label htmlFor="title" className="text-sm font-medium">
							Title <span className="text-destructive">*</span>
						</label>
						<Input id="title" name="title" required placeholder="Top Digital Product Experience 2025" value={formData.title} onChange={handleChange} />
					</div>

					<div className="space-y-2">
						<label htmlFor="tags" className="text-sm font-medium">
							Category/Tags <span className="text-destructive">*</span>
						</label>
						<TagInput
							tags={selectedTagOptions}
							setTags={(tags) => {
								setSelectedTagOptions(tags);
								setFormData((prev) => ({
									...prev,
									tagIds: tags.map((t) => t.value),
								}));
							}}
							placeholder="Select tags"
							allTags={allTagOptions}
						/>
						<p className="text-muted-foreground text-xs">Select from existing tags or create new ones</p>
					</div>

					<div className="space-y-2">
						<label htmlFor="date" className="text-sm font-medium">
							Date <span className="text-destructive">*</span>
						</label>
						<Input id="date" name="date" type="date" required value={formData.date} onChange={handleChange} />
					</div>

					<div className="space-y-2">
						<label htmlFor="institution" className="text-sm font-medium">
							Institution <span className="text-destructive">*</span>
						</label>
						<Input id="institution" name="institution" required placeholder="Indonesia Product Design Forum" value={formData.institution} onChange={handleChange} />
					</div>

					<div className="space-y-2">
						<label htmlFor="location" className="text-sm font-medium">
							Location <span className="text-destructive">*</span>
						</label>
						<Input id="location" name="location" required placeholder="Jakarta" value={formData.location} onChange={handleChange} />
					</div>

					<div className="space-y-2">
						<label htmlFor="description" className="text-sm font-medium">
							Description <span className="text-destructive">*</span>
						</label>
						<Textarea id="description" name="description" required placeholder="Awarded for successfully designing a digital product flow that improved user retention and client satisfaction." value={formData.description} onChange={handleChange} rows={4} />
					</div>
				</div>
			</div>
		</div>
	);
}
