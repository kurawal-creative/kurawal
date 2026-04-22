"use client";

import React, { useEffect, useMemo } from "react";
import { CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import Pill from "./pill";

export type Tag<T> = {
	label: string;
	value: T;
};

interface TagInputProps<T> extends React.HTMLAttributes<HTMLDivElement> {
	tags: Tag<T>[];
	setTags: (tags: Tag<T>[]) => void;
	allTags: Tag<T>[];
	AllTagsLabel?: ({ value }: { value: T }) => React.ReactNode;
	placeholder?: string;
}

export function TagInput<T>({ tags, setTags, allTags, AllTagsLabel, placeholder = "Add tag", className, ...props }: TagInputProps<T>) {
	const container = React.useRef<HTMLDivElement>(null);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");

	useEffect(() => {
		const handlePointerDown = (event: MouseEvent) => {
			if (container.current && !container.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handlePointerDown);

		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
		};
	}, []);

	const handleBackSpace = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Backspace" && inputValue === "") {
			event.preventDefault();
			event.stopPropagation();
			setTags(tags.slice(0, tags.length - 1));
		}
		if (event.key === "Escape") {
			setOpen(false);
		}

		if (event.key === "Enter" && filteredTags.length > 0) {
			event.preventDefault();
			handleSelect(filteredTags[0]);
		}
	};

	const handleSelect = (selectedTag: Tag<T>) => {
		if (!tags.some((tag) => tag.label === selectedTag.label)) {
			setTags([...tags, selectedTag]);
		}
		setInputValue("");
		setOpen(true);
		inputRef.current?.focus();
	};

	const handleRemove = (tagToRemove: Tag<T>) => {
		setTags(tags.filter((tag) => tag.label !== tagToRemove.label));
	};

	const handleClearTags = () => {
		setTags([]);
		setInputValue("");
		setOpen(false);
	};

	const filteredTags = useMemo(() => {
		return allTags.filter((tag) => tag.label.toLowerCase().includes(inputValue.toLowerCase()) && !tags.some((selectedTag) => selectedTag.label === tag.label));
	}, [allTags, inputValue, tags]);

	return (
		<div className={cn("relative space-y-2", className)} ref={container} {...props}>
			<div className={cn("flex w-full flex-wrap items-center gap-2 rounded-md border p-2 hover:cursor-text")} onClick={() => inputRef.current?.focus()}>
				{tags.map((tag) => (
					<Pill key={tag.label} label={tag.label} onClick={() => handleRemove(tag)} />
				))}

				<div className="flex grow items-center justify-end">
					<div className="min-w-0 flex-1">
						<input
							ref={inputRef}
							type="text"
							placeholder={placeholder}
							value={inputValue}
							onChange={(event) => {
								setInputValue(event.target.value);
								setOpen(true);
							}}
							onFocus={() => setOpen(true)}
							onKeyDown={handleBackSpace}
							className="placeholder:text-muted-foreground h-8 w-full bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
					{tags.length > 0 && <CircleX className="text-muted-foreground ml-2 h-4 w-4 shrink-0 cursor-pointer transition-colors hover:text-red-700" onClick={handleClearTags} />}
				</div>
			</div>

			{open && (
				<div className="bg-popover text-popover-foreground absolute top-[calc(100%+0.25rem)] right-0 left-0 z-50 rounded-md border shadow-md">
					<div className="hide-scrollbar max-h-56 overflow-y-auto p-1">
						{filteredTags.length === 0 ? (
							<div className="text-muted-foreground px-2 py-2 text-sm">No tags found.</div>
						) : (
							filteredTags.map((tag) => (
								<button key={tag.label} type="button" onClick={() => handleSelect(tag)} className="hover:bg-accent hover:text-accent-foreground w-full rounded-sm px-2 py-2 text-left text-sm">
									{AllTagsLabel ? <AllTagsLabel value={tag.value} /> : tag.label}
								</button>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
}
