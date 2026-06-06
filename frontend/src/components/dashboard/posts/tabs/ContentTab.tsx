import { Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { Editor } from "@/components/blocks/editor-x/editor";
import type { SerializedEditorState } from "lexical";

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
			<div className="mx-auto space-y-4 py-6">
				{/* Cover Image Area - Compact & Natural */}
				{thumbnailPreview ? (
					<div className="group relative overflow-hidden rounded-md">
						<img src={thumbnailPreview} alt="Cover" className="h-auto max-h-70 w-full object-cover" />
						{uploadingThumbnail && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
								<div className="flex flex-col items-center gap-2 text-white">
									<div className="relative h-12 w-12">
										<svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
											<path d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
											<path d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray={`${thumbnailUploadProgress}, 100`} strokeLinecap="round" />
										</svg>
										<span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">{thumbnailUploadProgress}%</span>
									</div>
									<p className="text-xs">Uploading...</p>
								</div>
							</div>
						)}
						<div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
						<div className="absolute top-3 right-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
							<button type="button" onClick={onThumbnailEdit} disabled={uploadingThumbnail} className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur-md transition-colors hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-50">
								<Pencil className="mr-1.5 h-3.5 w-3.5" />
								Change
							</button>
							<button type="button" onClick={onThumbnailRemove} disabled={uploadingThumbnail} className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1.5 text-xs text-red-100 backdrop-blur-md transition-colors hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50">
								<Trash2 className="mr-1.5 h-3.5 w-3.5" />
								Remove
							</button>
						</div>
					</div>
				) : (
					<button type="button" onClick={() => openThumbnailPickerRef.current?.()} className="group text-muted-foreground hover:text-foreground flex w-full items-center gap-2 py-2 text-left text-sm transition-colors">
						<ImageIcon className="h-4 w-4" />
						<span>Add cover</span>
					</button>
				)}

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
