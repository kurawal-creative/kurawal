"use client";

import { useState, useRef } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

// Ui component
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Dropzone, DropZoneArea, DropzoneDescription, DropzoneFileList, DropzoneFileListItem, DropzoneMessage, DropzoneRemoveFile, DropzoneTrigger, useDropzone } from "@/components/ui/dropzone";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as TagInput from "@diceui/tags-input";
import { type SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-x/editor";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Lucide icon
import { X, CloudUploadIcon, Trash2Icon, BrushCleaningIcon, Crop } from "lucide-react";

// Layout
import AdminLayout from "@/components/layouts/AdminLayout";
import EasyCrop from "@/components/ui/easy-crop";
import AddTags from "@/components/admin/create-post/add-tags";
import AddTechs from "@/components/admin/create-post/add-techs";

const initialValue = {
	root: {
		children: [
			{
				children: [
					{
						detail: 0,
						format: 0,
						mode: "normal",
						style: "",
						text: "Tuliskan Paragraf indah disini",
						type: "text",
						version: 1,
					},
				],
				direction: "ltr",
				format: "",
				indent: 0,
				type: "paragraph",
				version: 1,
			},
		],
		direction: "ltr",
		format: "",
		indent: 0,
		type: "root",
		version: 1,
	},
} as unknown as SerializedEditorState;

export function MultiImages() {
	// Dropzone
	const dropzone = useDropzone({
		onDropFile: async (file: File) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			// Demo
			return {
				status: "success",
				result: URL.createObjectURL(file),
			};
		},
		validation: {
			accept: {
				"image/*": [".png", ".jpg", ".jpeg"],
			},
		},
	});

	return (
		<div className="not-prose flex flex-col gap-4">
			<Dropzone {...dropzone}>
				<div>
					<div className="flex justify-between">
						<DropzoneMessage />
					</div>
					<DropZoneArea>
						<DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm">
							<CloudUploadIcon className="size-8" />
							<div>
								<p className="font-semibold">Upload listing images</p>
								<p className="text-muted-foreground text-sm">Click here or drag and drop to upload</p>
							</div>
						</DropzoneTrigger>
					</DropZoneArea>
				</div>

				<DropzoneFileList className="grid grid-cols-3 gap-3 p-0">
					{dropzone.fileStatuses.map((file) => (
						<DropzoneFileListItem className="bg-secondary overflow-hidden rounded-md p-0 shadow-sm" key={file.id} file={file}>
							{file.status === "pending" && <div className="aspect-video animate-pulse bg-black/20" />}
							{file.status === "success" && (
								// eslint-disable-next-line @next/next/no-img-element
								<img src={file.result} alt={`uploaded-${file.fileName}`} className="aspect-video object-cover" />
							)}
							<div className="flex items-center justify-between p-2 pl-4">
								<div className="min-w-0">
									<p className="truncate text-sm">{file.fileName}</p>
									<p className="text-muted-foreground text-xs">{(file.file.size / (1024 * 1024)).toFixed(2)} MB</p>
								</div>
								<DropzoneRemoveFile variant="ghost" className="shrink-0 hover:outline">
									<Trash2Icon className="size-4" />
								</DropzoneRemoveFile>
							</div>
						</DropzoneFileListItem>
					))}
				</DropzoneFileList>
			</Dropzone>
		</div>
	);
}

export default function CreatePost() {
	const [title, setTitle] = useState("");
	const [tipe, setTipe] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = React.useState<string[]>([]);
	const [techs, setTechs] = React.useState<string[]>([]);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [cropOpen, setCropOpen] = useState(false);
	const [cropSrc, setCropSrc] = useState<string | null>(null); // sumber gambar yang dipilih
	const [croppedUrl, setCroppedUrl] = useState<string | null>(null); // hasil crop untuk preview
	const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null); // hasil crop untuk upload

	const existingTags = React.useMemo(() => ["react", "nextJs"], []);
	const existingTechs = React.useMemo(() => ["HTML", "CSS"], []);

	const [tagQuery, setTagQuery] = useState("");
	const [techQuery, setTechQuery] = useState("");

	const filteredTagSuggestions = React.useMemo(() => (tagQuery.length === 0 ? [] : existingTags.filter((t) => t.toLowerCase().includes(tagQuery.toLowerCase()) && !tags.some((used) => used.toLowerCase() === t.toLowerCase())).slice(0, 8)), [tagQuery, existingTags, tags]);
	const filteredTechSuggestions = React.useMemo(() => (tagQuery.length === 0 ? [] : existingTechs.filter((t) => t.toLowerCase().includes(techQuery.toLowerCase()) && !techs.some((used) => used.toLowerCase() === t.toLowerCase())).slice(0, 8)), [techQuery, existingTechs, techs]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await api.post("/posts", { title, content });
			navigate("/posts");
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to create post");
		}
	};

	const handlePickClick = () => fileInputRef.current?.click();

	const handleFilePicked: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const f = e.target.files?.[0];
		if (!f) return;
		const url = URL.createObjectURL(f);
		setCropSrc(url);
		setCropOpen(true);
		// optional: reset input agar bisa pilih file yang sama lagi nanti
		e.currentTarget.value = "";
	};

	const handleCropped = ({ blob, url }: { blob: Blob; url: string }) => {
		// simpan hasil crop
		if (cropSrc) URL.revokeObjectURL(cropSrc);
		setCroppedBlob(blob);
		setCroppedUrl(url);
		setCropSrc(null); // penting: kosongkan agar tidak memakai URL yang sudah di-revoke
	};

	const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue);

	return (
		<AdminLayout>
			<div className="container mx-auto w-full max-w-4xl">
				{/* Section: Cover Image + Crop */}
				<div className="mb-6 space-y-3">
					<div className="not-prose flex flex-col gap-4">
						{!croppedUrl ? (
							<div onClick={handlePickClick} className="border-input bg-background hover:bg-accent flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed p-10 text-center text-sm transition-colors">
								<CloudUploadIcon className="text-muted-foreground size-8" />
								<div>
									<p className="font-semibold">Upload cover image</p>
									<p className="text-muted-foreground text-sm">Click here or drag and drop to upload</p>
								</div>
							</div>
						) : (
							<div className="overflow-hidden rounded-lg border">
								<div className="aspect-video w-full overflow-hidden">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={croppedUrl} alt="Cover preview" className="h-full w-full object-cover" />
								</div>
								<div className="flex items-center justify-between p-4">
									<p className="text-sm font-medium">Cover Image</p>
									<div className="flex gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => {
												setCropSrc(croppedUrl);
												setCropOpen(true);
											}}
										>
											<Crop className="mr-2 size-4" />
											Crop Ulang
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => {
												if (croppedUrl) URL.revokeObjectURL(croppedUrl);
												setCroppedUrl(null);
												setCroppedBlob(null);
											}}
										>
											<Trash2Icon className="size-4" />
										</Button>
									</div>
								</div>
							</div>
						)}
						<input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFilePicked} />
					</div>
				</div>

				{/* Modal cropper */}
				<EasyCrop open={cropOpen} onOpenChange={setCropOpen} imageSrc={cropSrc ?? croppedUrl ?? null} aspect={16 / 9} onCropped={handleCropped} />

				{/* Title live preview */}
				<Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-none border-0 border-b-2 pb-2 pl-0 text-2xl! font-medium shadow-none" required placeholder="Enter post title" />
				{/* <h1 id="title-placeholder" className="border-b text-2xl font-semibold">
					{title || "Title"}
				</h1> */}

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* <MultiImages /> */}
					<div className="w-2xl">{/* <EasyCrop /> */}</div>
					<div className="flex gap-8">
						<p className="text-sm text-gray-400">
							Status : <span className="font-semibold text-gray-800">Published</span>
						</p>
						<p className="text-sm text-gray-400">
							Last Modified : <span className="font-semibold text-gray-800">May 28th 2025, 4:47 PM</span>
						</p>
						<p className="text-sm text-gray-400">
							Created : <span className="font-semibold text-gray-800">May 28th 2025, 4:45 PM</span>
						</p>
					</div>
					<div className="space-y-2">
						<div className="flex gap-4">
							<div className="flex-1">
								<Label className="mb-2" htmlFor="type_post">
									Tipe Postingan<span className="text-red-500">*</span>{" "}
								</Label>
								<Select onValueChange={setTipe}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Pilih tipe" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Showcase">Showcase</SelectItem>
										<SelectItem value="article">Article</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex-1">
								<Label className="mb-2" htmlFor="type_post">
									Author<span className="text-red-500">*</span>{" "}
								</Label>
								<Select>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Pilih Author" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Ozan">Ozan</SelectItem>
										<SelectItem value="Iyan">Iyan</SelectItem>
										<SelectItem value="Dhodo">Dhodo</SelectItem>
										<SelectItem value="Gilang">Gilang</SelectItem>
										<SelectItem value="Wirman">Wirman</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<div className="flex gap-4">
						<AddTags />
						{/* <div className="flex-1">
							<Label className="mb-2" htmlFor="title">
								Tag<span className="text-red-500">*</span>{" "}
							</Label>
							<TagInput.Root
								value={tags}
								onValueChange={(v) => {
									setTags(v);
								}}
								className="flex w-full flex-col gap-2"
								editable
							>
								<div className="relative flex w-full flex-col">
									<div className="border-input bg-background flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-zinc-500 dark:focus-within:ring-zinc-400">
										{tags.map((tag) => (
											<TagInput.Item
												key={tag}
												value={tag}
												className="inline-flex max-w-[calc(100%-8px)] items-center gap-1.5 rounded border bg-transparent px-2.5 py-1 text-sm data-editable:select-none data-editing:ring-1 data-editing:ring-zinc-500 dark:data-editing:ring-zinc-400 [&:not([data-editing])]:pr-1.5 [&[data-highlighted]:not([data-editing])]:bg-zinc-200 [&[data-highlighted]:not([data-editing])]:text-black dark:[&[data-highlighted]:not([data-editing])]:bg-zinc-800 dark:[&[data-highlighted]:not([data-editing])]:text-white"
											>
												<TagInput.ItemText className="truncate" />
												<TagInput.ItemDelete className="h-4 w-4 shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100">
													<X className="h-3.5 w-3.5" />
												</TagInput.ItemDelete>
											</TagInput.Item>
										))}
										<TagInput.Input
											placeholder="Tambahkan tag"
											value={tagQuery}
											onChange={(e) => setTagQuery(e.target.value)}
											onKeyDown={(e) => {
												// Jika tekan Escape tutup saran
												if (e.key === "Escape") {
													setTagQuery("");
												}
												// Enter: biarkan TagInput menambah (jika library otomatis) kemudian reset query
												if (e.key === "Enter") {
													// jika tidak ada suggestion cocok, tag baru akan dibuat oleh library (pastikan lib mendukung)
													setTimeout(() => {
														setTagQuery("");
													}, 0);
												}
											}}
											className="flex-1 bg-transparent outline-hidden placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
										/>
										<TagInput.Clear
											onClick={() => {
												setTags([]);
												setTagQuery("");
											}}
										>
											<BrushCleaningIcon className="h-4 w-4 text-red-500" />
										</TagInput.Clear>
									</div>

									{filteredTagSuggestions.length > 0 && (
										<ul className="absolute top-full left-0 z-20 mt-1 w-full overflow-hidden rounded-md border bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
											{filteredTagSuggestions.map((s) => (
												<li
													key={s}
													onMouseDown={(e) => {
														// gunakan onMouseDown agar tidak kehilangan fokus input
														e.preventDefault();
														setTags((prev) => [...prev, s]);
														setTagQuery("");
													}}
													className="cursor-pointer px-3 py-2 text-sm select-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
												>
													{s}
												</li>
											))}
										</ul>
									)}

									{tagQuery.length > 0 && filteredTagSuggestions.length === 0 && <div className="text-muted-foreground absolute top-full left-0 z-10 mt-1 w-full rounded-md border bg-white px-3 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-900">Tidak ada hasil. Tekan Enter untuk menambahkan "{tagQuery}".</div>}
								</div>
							</TagInput.Root>
						</div> */}

						{/* Tech Stack input */}
						<div className={`${tipe === "Showcase" ? "" : "hidden"} flex-1`}>
							<AddTechs />
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="content">Description</Label>
						{/* <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Write your post content here..." rows={6} /> */}
						<Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Write your post content here..." rows={6} />
					</div>

					<Label htmlFor="content">Content</Label>
					<Editor editorSerializedState={editorState} onSerializedChange={(value) => setEditorState(value)} />
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<div className="flex gap-4">
						<Button type="submit" variant={"outline"} className="w-full">
							Save Draft
						</Button>
						<Button type="submit" className="w-full">
							Create Post
						</Button>
					</div>
				</form>
			</div>
		</AdminLayout>
	);
}
