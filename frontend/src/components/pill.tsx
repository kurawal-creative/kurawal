import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Badge } from "./ui/badge";

interface PillProps {
	label: string;
	className?: string;
	onClick?: () => void;
}

export default function Pill({ label, className, onClick }: PillProps) {
	return (
		<Badge className={cn("text-muted-foreground border-muted-foreground flex items-center justify-between gap-2 rounded-md border bg-inherit px-2 py-1 hover:bg-inherit", className)}>
			<span className="flex-1 text-center">{label}</span>
			{onClick && (
				<button
					type="button"
					aria-label={`Remove ${label}`}
					className="inline-flex items-center justify-center"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onClick();
					}}
				>
					<X className="h-4 w-4 shrink-0 cursor-pointer transition-colors hover:text-red-700" />
				</button>
			)}
		</Badge>
	);
}
