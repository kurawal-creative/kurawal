import { Pencil, Trash2, Image as Upload } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { Editor } from "@/components/blocks/editor-x/editor";
import type { SerializedEditorState } from "lexical";
import { Button } from "@/components/ui/button";

interface ContentTabProps {
	formData: {
		title: string;
		content: string;
	};
	thumbnailPreview: string;
	uploadingThumbnail: boolean;
	thumbnailUploadProgress: number;
	openThumbnailPickerRef: React.MutableRefObject<(() => void) | null>;
	onTitleChange: (title: string) => void;
	onContentChange: (content: string) => void;
	onThumbnailUpload: (file: File) => void;
	onThumbnailEdit: () => void;
	onThumbnailRemove: () => void;
	editorSerializedState?: SerializedEditorState;
}

export function ContentTab({ formData, thumbnailPreview, uploadingThumbnail, thumbnailUploadProgress, openThumbnailPickerRef, onTitleChange, onContentChange, onThumbnailUpload, onThumbnailEdit, onThumbnailRemove, editorSerializedState }: ContentTabProps) {
	return (
		<div className="w-full">
			<div className="mx-auto space-y-6 py-6">
				{/* Cover Image Area - Enhanced UI/UX */}
				<div className="space-y-2">
					{thumbnailPreview ? (
						<div className="group relative overflow-hidden rounded-lg border">
							<img src={thumbnailPreview} alt="Cover" className="h-auto max-h-96 w-full object-cover" />
							{uploadingThumbnail && (
								<div className="bg-background/80 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
									<div className="flex flex-col items-center gap-3">
										<div className="relative h-16 w-16">
											<svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
												<path d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted" opacity="0.2" />
												<path d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${thumbnailUploadProgress}, 100`} strokeLinecap="round" className="text-primary" />
											</svg>
											<span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">{thumbnailUploadProgress}%</span>
										</div>
										<p className="text-muted-foreground text-sm font-medium">Uploading...</p>
									</div>
								</div>
							)}
							<div className="bg-background/60 absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
							<div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
								<Button type="button" onClick={onThumbnailEdit} disabled={uploadingThumbnail} variant="secondary" size="sm">
									<Pencil className="mr-2 h-4 w-4" />
									Change
								</Button>
								<Button type="button" onClick={onThumbnailRemove} disabled={uploadingThumbnail} variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
									<Trash2 className="mr-2 h-4 w-4" />
									Remove
								</Button>
							</div>
						</div>
					) : (
						<button
							type="button"
							onClick={() => openThumbnailPickerRef.current?.()}
							className="border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 group flex h-48 w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-all"
						>
							<div className="bg-muted group-hover:bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
								<Upload className="text-muted-foreground group-hover:text-primary h-8 w-8 transition-colors" />
							</div>
							<div className="flex flex-col items-center gap-1">
								<p className="text-sm font-medium">Click to upload cover image</p>
								<p className="text-muted-foreground text-xs">Recommended size: 1200x630px (16:9 ratio)</p>
							</div>
						</button>
					)}
				</div>

				<ImageUploader
					showDropzone={false}
					aspectRatio={16 / 9}
					maxSize={10 * 1024 * 1024}
					acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
					registerOpenFileDialog={(openDialog) => {
						openThumbnailPickerRef.current = openDialog;
					}}
					onImageCropped={(blob) => {
						const file = new File([blob], `thumbnail-${Date.now()}.jpg`, {
							type: blob.type || "image/jpeg",
						});
						onThumbnailUpload(file);
					}}
				/>

				{/* Title Input - Large and Clean */}
				<input type="text" value={formData.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Untitled" required className="placeholder:text-muted-foreground/30 w-full border-none bg-transparent px-0 py-0 text-5xl leading-tight font-bold tracking-tight shadow-none outline-none focus:outline-none" />

				{/* Content Editor */}
				<div className="pt-2">
					<Editor
						editorSerializedState={editorSerializedState}
						onSerializedChange={(editorSerializedState) => {
							onContentChange(JSON.stringify(editorSerializedState));
						}}
					/>
				</div>
			</div>
		</div>
	);
}
