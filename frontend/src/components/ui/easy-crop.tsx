import React, { useCallback, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type EasyCropDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	imageSrc: string | null; // object URL / data URL
	aspect?: number; // default 16/9
	onCropped: (result: { blob: Blob; url: string }) => void;
};

async function createImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		// penting untuk sumber cross-origin
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = (e) => reject(e);
		img.src = src;
	});
}

async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas not supported");

	// set ukuran canvas sesuai area crop
	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) return reject(new Error("Failed to create blob"));
				resolve(blob);
			},
			"image/jpeg",
			0.92,
		);
	});
}

const EasyCrop: React.FC<EasyCropDialogProps> = ({ open, onOpenChange, imageSrc, aspect = 16 / 9, onCropped }) => {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [busy, setBusy] = useState(false);

	const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
		setCroppedAreaPixels(areaPixels);
	}, []);

	const handleConfirm = useCallback(async () => {
		if (!imageSrc || !croppedAreaPixels) return;
		setBusy(true);
		try {
			const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
			const url = URL.createObjectURL(blob);
			onCropped({ blob, url });
			onOpenChange(false);
		} finally {
			setBusy(false);
		}
	}, [imageSrc, croppedAreaPixels, onCropped, onOpenChange]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Crop Image</DialogTitle>
				</DialogHeader>

				<div className="relative h-[420px] w-full rounded-md bg-black/70">{imageSrc ? <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={aspect} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} minZoom={1} maxZoom={3} cropShape="rect" showGrid objectFit="cover" /> : null}</div>

				<div className="flex items-center gap-4">
					<span className="text-sm font-medium">Zoom</span>
					<Slider value={[zoom]} min={1} max={3} step={0.05} onValueChange={(v) => setZoom(v[0])} className="flex-1" />
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
						Cancel
					</Button>
					<Button onClick={handleConfirm} disabled={!imageSrc || !croppedAreaPixels || busy}>
						{busy ? "Processing..." : "Crop & Use"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EasyCrop;
