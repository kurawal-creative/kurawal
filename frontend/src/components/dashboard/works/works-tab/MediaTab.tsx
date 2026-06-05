import { Upload, Loader2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaTabProps {
	formData: {
		images: string[];
	};
	uploading: boolean;
	handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
	removeImage: (index: number) => void;
}

export default function MediaTab({ formData, uploading, handleImageChange, removeImage }: MediaTabProps) {
	return (
		<div className="space-y-6">
			<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
				<div className="flex items-center justify-between border-b px-6 py-4">
					<div>
						<h2 className="text-base font-semibold">
							Project Images <span className="text-destructive">*</span>
						</h2>
						<p className="text-muted-foreground mt-1 text-sm">Upload project screenshots or images (at least 1 required)</p>
					</div>
					{formData.images.length > 0 && (
						<label className="cursor-pointer">
							<Button type="button" size="sm" disabled={uploading} asChild>
								<span>
									{uploading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Uploading...
										</>
									) : (
										<>
											<Plus className="mr-2 h-4 w-4" />
											Add Images
										</>
									)}
								</span>
							</Button>
							<input type="file" accept="image/*" multiple onChange={handleImageChange} disabled={uploading} className="hidden" />
						</label>
					)}
				</div>
				<div className="p-6">
					{formData.images.length > 0 ? (
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
							{formData.images.map((url, idx) => (
								<div key={idx} className="group bg-muted hover:border-primary relative aspect-square overflow-hidden rounded-lg border-2 transition-all">
									<img src={url} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
									<div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
										<button type="button" onClick={() => removeImage(idx)} className="hover:bg-destructive/90 bg-destructive text-destructive-foreground rounded-full p-2 shadow-lg transition-colors">
											<X className="h-4 w-4" />
										</button>
									</div>
									<div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">#{idx + 1}</div>
								</div>
							))}
						</div>
					) : (
						<label className="hover:border-primary/50 hover:bg-muted/50 flex aspect-video h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all">
							{uploading ? (
								<>
									<Loader2 className="text-muted-foreground mb-3 h-12 w-12 animate-spin" />
									<span className="text-muted-foreground text-sm font-medium">Uploading images...</span>
								</>
							) : (
								<>
									<div className="bg-primary/10 mb-4 rounded-full p-4">
										<Upload className="text-primary h-8 w-8" />
									</div>
									<span className="mb-1 text-sm font-semibold">Click to upload images</span>
									<span className="text-muted-foreground text-xs">PNG, JPG, WEBP up to 10MB each</span>
								</>
							)}
							<input type="file" accept="image/*" multiple onChange={handleImageChange} disabled={uploading} className="hidden" />
						</label>
					)}
				</div>
			</div>
		</div>
	);
}
