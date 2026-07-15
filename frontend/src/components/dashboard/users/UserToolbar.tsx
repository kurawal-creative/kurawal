import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown } from "lucide-react";

interface UserToolbarProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
}

export function UserToolbar({ searchTerm, onSearchChange }: UserToolbarProps) {
	return (
		<div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
			<div className="flex items-center gap-2">
				<div className="relative w-full lg:w-92">
					<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search users..." className="h-9 pl-9" />
				</div>
			</div>

			<div className="flex gap-2">
				<Button variant="outline" size="icon" className="h-9 w-10">
					<Filter className="h-4 w-4" />
				</Button>
				<Button variant="outline" size="icon" className="h-9 w-10">
					<ArrowUpDown className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
