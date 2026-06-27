import { Upload, X, Loader2 } from "lucide-react";

interface MediaTabProps {
	formData: {
		images: string[];
	};
	uploading: boolean;
	handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	removeImage: (index: number) => void;
}

export default function MediaTab({ formData, uploading, handleImageChange, removeImage }: MediaTabProps) {
	return (
		<div className="space-y-6">
			<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
				<div className="border-b px-6 py-4">
					<h2 className="text-base font-semibold">Award Images</h2>
					<p className="text-muted-foreground mt-1 text-sm">Upload certificate or award photos (at least one required)</p>
				</div>

				<div className="space-y-5 p-6">
					<div className="space-y-2">
						<label className="text-sm font-medium">
							Images <span className="text-destructive">*</span>
						</label>

						<div className="border-input bg-background ring-offset-background focus-visible:ring-ring flex min-h-32 w-full flex-col items-center justify-center rounded-md border border-dashed px-3 py-8 text-sm transition-colors hover:border-gray-400">
							<input type="file" id="image-upload" multiple accept="image/*" onChange={handleImageChange} className="hidden" disabled={uploading} />

							<label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center gap-2">
								{uploading ? (
									<>
										<Loader2 className="text-muted-foreground h-10 w-10 animate-spin" />
										<p className="text-muted-foreground text-sm">Uploading images...</p>
									</>
								) : (
									<>
										<Upload className="text-muted-foreground h-10 w-10" />
										<p className="text-muted-foreground text-sm">
											Click to upload or drag and drop
											<br />
											<span className="text-xs">PNG, JPG, JPEG (max. 5MB each)</span>
										</p>
									</>
								)}
							</label>
						</div>

						{formData.images.length > 0 && (
							<div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
								{formData.images.map((url, idx) => (
									<div key={idx} className="group relative aspect-video overflow-hidden rounded-lg border">
										<img src={url} alt={`Award ${idx + 1}`} className="h-full w-full object-cover" />
										<button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100">
											<X className="h-4 w-4" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
