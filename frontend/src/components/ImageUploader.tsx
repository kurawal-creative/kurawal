import { cn } from "@/lib/utils";
import { Upload, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Slider } from "./ui/slider";

interface Point {
	x: number;
	y: number;
}

interface Area {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Props for the ImageUploader component
 */
interface ImageUploaderProps {
	/**
	 * The aspect ratio of the cropped image (width / height)
	 * @default 1 (square)
	 */
	aspectRatio?: number;

	/**
	 * Maximum file size in bytes
	 * @default 5242880 (5MB)
	 */
	maxSize?: number;

	/**
	 * Allowed file types
	 * @default ['image/jpeg', 'image/png', 'image/webp']
	 */
	acceptedFileTypes?: string[];

	/**
	 * CSS class name for the container
	 */
	className?: string;

	/**
	 * Callback function that returns the cropped image as a blob or file
	 */
	onImageCropped?: (blob: Blob) => void;

	/**
	 * Controls whether the drag-and-drop upload zone is rendered
	 * @default true
	 */
	showDropzone?: boolean;

	/**
	 * Exposes a function to open the native file picker programmatically
	 */
	registerOpenFileDialog?: (openFileDialog: () => void) => void;
}

/**
 * A reusable image uploader component with drag & drop, preview, and crop functionality
 */
export function ImageUploader({
	aspectRatio = 1,
	maxSize = 5 * 1024 * 1024, // 5MB
	acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
	className,
	onImageCropped,
	showDropzone = true,
	registerOpenFileDialog,
}: ImageUploaderProps) {
	const [image, setImage] = useState<string | null>(null);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [error, setError] = useState<string | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	const openFileDialog = useCallback(() => {
		if (!inputRef.current) return;
		inputRef.current.value = "";
		inputRef.current.click();
	}, []);

	useEffect(() => {
		if (!registerOpenFileDialog) return;
		registerOpenFileDialog(openFileDialog);
	}, [registerOpenFileDialog, openFileDialog]);

	// We're not using a drop library like react-dropzone, so this is handled manually with DOM events

	const handleFileSelect = (file: File | null) => {
		if (!file) return;

		setError(null);

		// Check file type
		if (!acceptedFileTypes.includes(file.type)) {
			setError(`File type not supported. Accepted types: ${acceptedFileTypes.join(", ")}`);
			return;
		}

		// Check file size
		if (file.size > maxSize) {
			setError(`File is too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			setImage(reader.result as string);
			setIsCropDialogOpen(true);
		};
		reader.readAsDataURL(file);
	};

	const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	const cropImage = useCallback(async () => {
		if (!image || !croppedAreaPixels) return;

		const canvas = document.createElement("canvas");
		const img = new Image();
		img.src = image;

		await new Promise((resolve) => {
			img.onload = resolve;
		});

		const scaleX = img.naturalWidth / img.width;
		const scaleY = img.naturalHeight / img.height;

		canvas.width = croppedAreaPixels.width;
		canvas.height = croppedAreaPixels.height;

		const ctx = canvas.getContext("2d");

		if (ctx) {
			ctx.drawImage(img, croppedAreaPixels.x * scaleX, croppedAreaPixels.y * scaleY, croppedAreaPixels.width * scaleX, croppedAreaPixels.height * scaleY, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height);

			canvas.toBlob((blob) => {
				if (blob) {
					const previewUrl = URL.createObjectURL(blob);
					setPreviewImage(previewUrl);
					if (onImageCropped) {
						onImageCropped(blob);
					}
					setIsCropDialogOpen(false);
				}
			}, "image/jpeg");
		}
	}, [image, croppedAreaPixels]);

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			handleFileSelect(e.dataTransfer.files[0]);
		}
	};

	return (
		<div className={cn("w-full", className)}>
			<input ref={inputRef} type="file" className="hidden" accept={acceptedFileTypes.join(",")} onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)} />

			{/* <Card className="w-full">
				<CardHeader>
					<CardTitle className="flex items-center justify-between">Thumbnail Image</CardTitle>
				</CardHeader>
				<CardContent></CardContent>
				<CardFooter className="flex justify-between">
					<p className="text-muted-foreground text-xs">Upload an image to preview and crop</p>
				</CardFooter>
			</Card> */}

			{/* <div className="flex w-full items-end justify-end">
				{previewImage && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button size="icon" variant="outline" onClick={clearImage}>
									<Trash2 size={16} />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Clear image</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div> */}
			{showDropzone && !previewImage ? (
				<div className="hover:bg-muted/20 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors" onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => inputRef.current?.click()}>
					<Upload className="text-muted-foreground mx-auto h-12 w-12" />
					<p className="text-muted-foreground mt-2 text-sm">Drag and drop an image here or click to browse</p>
					<p className="text-muted-foreground mt-1 text-xs">{`Accepted formats: ${acceptedFileTypes.map((type) => type.replace("image/", ".")).join(", ")}`}</p>
					<p className="text-muted-foreground mt-1 text-xs">{`Max size: ${maxSize / (1024 * 1024)}MB`}</p>
					{error && <p className="text-destructive mt-2 text-sm">{error}</p>}
				</div>
			) : showDropzone ? (
				<div className="relative overflow-hidden rounded-lg"></div>
			) : null}
			<Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Crop Image</DialogTitle>
					</DialogHeader>
					{image && (
						<>
							<div className="relative h-80 w-full">
								<Cropper image={image} crop={crop} zoom={zoom} aspect={aspectRatio} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
							</div>
							<div className="flex items-center gap-4">
								<ZoomOut className="h-4 w-4" />
								<Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={(value) => setZoom(value[0])} />
								<ZoomIn className="h-4 w-4" />
							</div>
							<div className="flex justify-end gap-2">
								<Button variant="outline" onClick={() => setIsCropDialogOpen(false)}>
									Cancel
								</Button>
								<Button onClick={cropImage}>Apply</Button>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
