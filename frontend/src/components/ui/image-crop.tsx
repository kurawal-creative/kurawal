"use client";
import { ImageCrop, ImageCropApply, ImageCropContent, ImageCropReset } from "@/components/ui/shadcn-io/image-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ChangeEvent, useState } from "react";
const ImageCropss = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			setCroppedImage(null);
		}
	};
	const handleReset = () => {
		setSelectedFile(null);
		setCroppedImage(null);
	};
	if (!selectedFile) {
		return (
			<div
				className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
				onClick={() => document.getElementById("file-input")?.click()}
				onDragOver={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onDrop={(e) => {
					e.preventDefault();
					e.stopPropagation();
					const file = e.dataTransfer.files?.[0];
					if (file && file.type.startsWith("image/")) {
						setSelectedFile(file);
						setCroppedImage(null);
					}
				}}
			>
				<div className="pointer-events-none flex flex-col items-center justify-center pt-5 pb-6">
					<svg className="mb-3 h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
					</svg>
					<p className="mb-2 text-sm text-gray-500">
						<span className="font-semibold">Click to upload</span> or drag and drop
					</p>
					<p className="text-xs text-gray-500">Image files only</p>
				</div>
				<Input id="file-input" accept="image/*" className="hidden" onChange={handleFileChange} type="file" />
			</div>
		);
	}
	if (croppedImage) {
		return (
			<div className="space-y-4">
				<img alt="Cropped" className="h-[100px] w-[100px]" src={croppedImage} />
				<Button onClick={handleReset} size="sm" type="button" variant="outline">
					Start Over
				</Button>
			</div>
		);
	}
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
				<button onClick={handleReset} className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none">
					<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<div className="w-full space-y-4">
					<ImageCrop
						className=""
						aspect={16 / 9}
						file={selectedFile}
						maxImageSize={1024 * 1024} // 1MB
						onChange={console.log}
						onComplete={console.log}
						onCrop={setCroppedImage}
					>
						<ImageCropContent className="max-w-md" />
						<div className="mt-4 flex items-center gap-2">
							<ImageCropApply asChild>
								<button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none">Apply Crop</button>
							</ImageCropApply>
							<ImageCropReset asChild>
								<button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none">Reset</button>
							</ImageCropReset>
							<button onClick={handleReset} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none">
								Start Over
							</button>
						</div>
					</ImageCrop>
				</div>
			</div>
		</div>
	);
};
export default ImageCropss;
