"Use Client";

import { type ColumnDef } from "@tanstack/react-table";
import { Ellipsis, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deleteMedia, pathToUrl } from "@/helpers/media";

export type Media = {
	_id: string;
	publicId: string;
	status: string;
	filename: string;
	createdAt: string;
	__v: number;
};

// const cloudName = import.meta.en
export const columns: ColumnDef<Media>[] = [
	{
		id: "select",
		header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
		cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
		size: 32,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "publicId",
		header: "Image",
		cell: ({ getValue, row }) => {
			const src = getValue<string>();
			// const url = toImageUrl(src);
			return (
				<div className="flex items-center gap-3">
					<Dialog>
						<DialogTrigger asChild>
							<img
								src={pathToUrl(row.original.publicId)}
								alt={row.original._id}
								className="h-12 w-12 rounded border object-cover"
								onError={(e) => {
									e.currentTarget.src = "https://placehold.net/shape.svg";
								}}
							/>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Preview Image</DialogTitle>
							</DialogHeader>
							<img
								src={pathToUrl(row.original.publicId)}
								alt={row.original._id}
								className="h-full w-full rounded border object-cover"
								onError={(e) => {
									e.currentTarget.src = "https://placehold.net/shape.svg";
								}}
							/>
						</DialogContent>
					</Dialog>

					{row.original.publicId && <span className="text-muted-foreground max-w-[220px] truncate text-xs">{src}</span>}
				</div>
			);
		},
	},
	{
		header: "Ukuran",
		accessorKey: "size",
	},
	{ accessorKey: "created_at", header: "Created At" },
	{
		id: "actions",
		header: "",
		enableSorting: false,
		enableHiding: false,
		cell: ({ getValue, row }) => {
			return (
				<div className="flex justify-center">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Ellipsis className="size-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-20" align="center">
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => deleteMedia(row.original.publicId)} className="text-red-500">
									Hapus
								</DropdownMenuItem>
								<DropdownMenuItem>Edit</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
