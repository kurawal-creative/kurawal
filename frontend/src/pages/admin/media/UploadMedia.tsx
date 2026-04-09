"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadItemProgress, FileUploadList, FileUploadTrigger, type FileUploadProps } from "@/components/ui/file-upload";
import { toast, Toaster } from "sonner";
import * as React from "react";
// import { } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns, type Media } from "@/pages/admin/media/Column";
// import { DataTable } from "@/components/"
import { Trash2Icon, Upload, X } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { getListMedia, uploadMedia } from "@/helpers/media";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import useMediaStore from "@/stores/media-store";

async function getData(): Promise<Media[]> {
	return (await getListMedia()).media;
	// return [
	// 	{
	// 		id: "728ed52f",
	// 		public_id: "0",
	// 		created_at: "24 June 2025",
	// 		size: "2.5 MB",
	// 	},
	// 	{
	// 		id: "1131",
	// 		public_id: "0",
	// 		created_at: "24 June 2025",
	// 		size: "2.5 MB",
	// 	},
	// 	{
	// 		id: "121",
	// 		public_id: "0",
	// 		created_at: "24 June 2025",
	// 		size: "2.5 MB",
	// 	},

	// 	// ...
	// ];
}

export function FileUploadValidation({ onAfterUpload }: { onAfterUpload?: () => void }) {
	const refresh = useMediaStore((s) => s.refresh);
	const [files, setFiles] = React.useState<File[]>([]);

	const onFileValidate = React.useCallback(
		(file: File): string | null => {
			// Validate max files
			if (files.length >= 2) {
				return "You can only upload up to 2 files";
			}

			// Validate file type (only images)
			if (!file.type.startsWith("image/")) {
				return "Only image files are allowed";
			}

			// Validate file size (max 2MB)
			const MAX_SIZE = 2 * 1024 * 1024; // 2MB
			if (file.size > MAX_SIZE) {
				return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
			}

			return null;
		},
		[files],
	);

	const onUpload: NonNullable<FileUploadProps["onUpload"]> = React.useCallback(
		async (files, { onProgress, onSuccess, onError }) => {
			try {
				const uploadPromises = files.map(async (file) => {
					try {
						const result = await uploadMedia(file, onProgress);
						if (!result) throw new Error("Gagal Upload");
						onSuccess(file);
						refresh();
					} catch (error) {
						onError(file, error instanceof Error ? error : new Error("Gagal Upload"));
					}
				});
				await Promise.all(uploadPromises);
				onAfterUpload?.(); // penting: segarkan data daftar media
			} catch (error) {
				console.error("Unexpected error during upload:", error);
			}
		},
		[onAfterUpload],
	);

	const onFileReject = React.useCallback((file: File, message: string) => {
		toast(message, {
			description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
		});
	}, []);

	return (
		<FileUpload value={files} onValueChange={setFiles} onFileValidate={onFileValidate} onFileReject={onFileReject} onUpload={onUpload} accept="image/*" maxFiles={2} className="mx-auto w-full max-w-4xl" multiple>
			<FileUploadDropzone>
				<div className="flex flex-col items-center gap-1">
					<div className="flex items-center justify-center rounded-full border p-2.5">
						<Upload className="text-muted-foreground size-6" />
					</div>
					<p className="text-sm font-medium">Drag & drop files here</p>
					<p className="text-muted-foreground text-xs">Or click to browse (max 2 files)</p>
				</div>
				<FileUploadTrigger asChild>
					<Button variant="outline" size="sm" className="mt-2 w-fit">
						Browse files
					</Button>
				</FileUploadTrigger>
			</FileUploadDropzone>
			<FileUploadList>
				{files.map((file) => (
					<FileUploadItem key={file.name} value={file}>
						<FileUploadItemPreview className="size-12">
							<FileUploadItemProgress variant="circular" />
						</FileUploadItemPreview>
						<FileUploadItemMetadata />
						<FileUploadItemDelete asChild>
							<Button variant="ghost" size="icon" className="size-5">
								<Trash2Icon />
							</Button>
						</FileUploadItemDelete>
					</FileUploadItem>
				))}
			</FileUploadList>
		</FileUpload>
	);
}

export default function UploadMedia() {
	// Ambil hanya slice yang dibutuhkan
	const fetch = useMediaStore((s) => s.fetch);
	const refresh = useMediaStore((s) => s.refresh);
	const loading = useMediaStore((s) => s.loading);
	const ids = useMediaStore((s) => s.ids);
	const byId = useMediaStore((s) => s.byId);

	// data tabel dari ids + byId (derivative, murah dihitung)
	const data = React.useMemo(() => ids.map((id) => byId[id]).filter(Boolean), [ids, byId]);

	React.useEffect(() => {
		fetch({ reset: true });
	}, [fetch]);

	const { table } = useDataTable({
		data,
		columns,
		pageCount: 1,
		initialState: {
			sorting: [{ id: "title", desc: true }],
			columnPinning: { right: ["actions"] },
		},
		getRowId: (row) => row._id,
	});

	return (
		<AdminLayout>
			<div className="mx-auto max-w-4xl">
				<div className="flex justify-between">
					<h1 className="text-xl font-bold">Daftar Media</h1>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant={"outline"}>Tambah Gambar</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-xl">
							<DialogHeader>
								<DialogTitle>Tambah Media</DialogTitle>
							</DialogHeader>
							<FileUploadValidation onAfterUpload={refresh} />
							<DialogFooter className="sm:justify-start">
								<DialogClose asChild>
									<Button type="button" variant={"secondary"}>
										Tutup
									</Button>
								</DialogClose>
								<Button variant={"default"} onClick={refresh} disabled={loading}>
									{loading ? "Menyegarkan..." : "Refresh"}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
				<div className="mx-auto mt-4">
					<DataTable table={table} />
				</div>
				<Toaster />
			</div>
		</AdminLayout>
	);
}
