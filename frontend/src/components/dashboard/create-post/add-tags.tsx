"use client";

import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import * as TagInput from "@diceui/tags-input";
import { X, BrushCleaningIcon } from "lucide-react";

export type AddTagsProps = {
	label?: string;
	required?: boolean;
	value?: string[];
	onChange?: (tags: string[]) => void;
	existingTags?: string[];
	placeholder?: string;
	id?: string;
	className?: string;
};

export function AddTags({ label = "Tag", required, value, onChange, existingTags = ["react", "nextjs", "typescript", "tailwind", "design", "ui", "performance", "security"], placeholder = "Tambahkan tag", id = "tags", className }: AddTagsProps) {
	const [tags, setTags] = useState<string[]>(value ?? []);
	const [query, setQuery] = useState("");

	// propagate to parent
	useEffect(() => {
		onChange?.(tags);
	}, [tags, onChange]);

	// sync external value
	useEffect(() => {
		if (value) setTags(value);
	}, [value]);

	const filteredSuggestions = useMemo(() => (query.length === 0 ? [] : existingTags.filter((t) => t.toLowerCase().includes(query.toLowerCase()) && !tags.some((used) => used.toLowerCase() === t.toLowerCase())).slice(0, 8)), [query, existingTags, tags]);

	return (
		<div className={className ?? "flex-1"}>
			<Label className="mb-2" htmlFor={id}>
				{label}
				{required ? <span className="text-red-500">*</span> : null}
			</Label>

			<TagInput.Root value={tags} onValueChange={setTags} className="flex w-full flex-col gap-2" editable>
				<div className="relative">
					<div className="flex min-h-10 w-full flex-wrap items-center gap-2 rounded border px-3 py-2 text-sm">
						{tags.map((tag) => (
							<TagInput.Item key={tag} value={tag} className="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm">
								<TagInput.ItemText />
								<TagInput.ItemDelete className="h-4 w-4 opacity-70 transition-opacity hover:opacity-100">
									<X className="h-3.5 w-3.5" />
								</TagInput.ItemDelete>
							</TagInput.Item>
						))}

						<TagInput.Input
							id={id}
							placeholder={placeholder}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Escape") setQuery("");
								if (e.key === "Enter") setTimeout(() => setQuery(""), 0);
							}}
							className="flex-1 bg-transparent outline-none placeholder:text-gray-500"
						/>

						<TagInput.Clear
							onClick={() => {
								setTags([]);
								setQuery("");
							}}
						>
							<BrushCleaningIcon className="h-4 w-4 text-red-500" />
						</TagInput.Clear>
					</div>

					{filteredSuggestions.length > 0 && (
						<ul className="absolute top-full left-0 z-20 mt-1 w-full overflow-hidden rounded border bg-white shadow">
							{filteredSuggestions.map((s) => (
								<li
									key={s}
									onMouseDown={(e) => {
										e.preventDefault();
										setTags((prev) => [...prev, s]);
										setQuery("");
									}}
									className="cursor-pointer px-3 py-2 text-sm select-none hover:bg-gray-100"
								>
									{s}
								</li>
							))}
						</ul>
					)}

					{query.length > 0 && filteredSuggestions.length === 0 && <div className="absolute top-full left-0 z-10 mt-1 w-full rounded border bg-white px-3 py-2 text-xs text-gray-500">Tidak ada hasil. Tekan Enter untuk menambahkan "{query}".</div>}
				</div>
			</TagInput.Root>
		</div>
	);
}

export default AddTags;
