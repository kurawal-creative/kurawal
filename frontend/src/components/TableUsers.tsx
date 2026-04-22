import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Shield, Trash, UserCheck, Users } from "lucide-react";

type User = {
	id: string;
	email: string;
	name: string;
	role: string;
	banned?: boolean;
	banReason?: string;
	createdAt: Date;
};

interface TableUsersProps {
	users: User[];
	loading: boolean;
	onBanUser: (userId: string) => Promise<void>;
	onUnbanUser: (userId: string) => Promise<void>;
	onDeleteUser: (userId: string) => Promise<void>;
	onSetRole: (userId: string, currentRole: string) => Promise<void>;
}

export default function TableUsers({ users, loading, onBanUser, onUnbanUser, onDeleteUser, onSetRole }: TableUsersProps) {
	if (loading && users.length === 0) {
		return (
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-25">ID</TableHead>
							<TableHead>Account</TableHead>
							<TableHead className="text-center">Role</TableHead>
							<TableHead className="text-center">Status</TableHead>
							<TableHead className="text-center">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(5)].map((_, i) => (
							<TableRow key={i}>
								<TableCell>
									<Skeleton className="h-4 w-12" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-32" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-24" />
								</TableCell>
								<TableCell>
									<Skeleton className="mx-auto h-4 w-16" />
								</TableCell>
								<TableCell>
									<Skeleton className="mx-auto h-4 w-12" />
								</TableCell>
								<TableCell>
									<Skeleton className="mx-auto h-8 w-24" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	if (users.length === 0) {
		return (
			<div className="rounded-md border">
				<Table>
					<TableHeader className="bg-muted">
						<TableRow className="border-b">
							<TableHead className="w-25 pl-6 text-xs font-medium">ID</TableHead>
							<TableHead className="text-xs font-medium">Name</TableHead>
							<TableHead className="text-xs font-medium">Email</TableHead>
							<TableHead className="text-start text-xs font-medium">Role</TableHead>
							<TableHead className="text-start text-xs font-medium">Status</TableHead>
							<TableHead className="text-center text-xs font-medium">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell colSpan={6}>
								<div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
									{/* Icon */}
									<div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
										<Users className="text-muted-foreground h-5 w-5" />
									</div>

									{/* Title */}
									<p className="text-sm font-medium">No users found</p>

									{/* Description */}
									<p className="text-muted-foreground max-w-xs text-xs">There are no users available. Try creating a new user to get started.</p>
								</div>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader className="bg-muted">
					<TableRow className="border-b">
						<TableHead className="w-25 pl-6 text-xs font-medium">ID</TableHead>
						<TableHead className="text-xs font-medium">Name</TableHead>
						<TableHead className="text-xs font-medium">Email</TableHead>
						<TableHead className="text-start text-xs font-medium">Role</TableHead>
						<TableHead className="text-start text-xs font-medium">Status</TableHead>
						<TableHead className="text-center text-xs font-medium">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell className="text-muted-foreground pl-6 font-mono text-xs">{user.id.slice(0, 6)}</TableCell>
							<TableCell>
								<div className="text-sm font-medium">{user.name}</div>
							</TableCell>
							<TableCell className="text-muted-foreground max-w-25 truncate text-sm">{user.email}</TableCell>
							<TableCell className="text-start">
								<Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
							</TableCell>
							<TableCell className="text-start">
								{user.banned ? (
									<Badge variant="destructive" className="text-xs">
										Banned
									</Badge>
								) : (
									<Badge className="border border-emerald-200 bg-emerald-100 text-xs text-emerald-700">Active</Badge>
								)}
							</TableCell>
							<TableCell className="text-center">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>

									<DropdownMenuContent align="end" className="w-40">
										{/* Toggle Role */}
										<DropdownMenuItem onClick={() => onSetRole(user.id, user.role)} className="flex items-center gap-2">
											<Shield className="h-4 w-4" />
											Set as {user.role === "admin" ? "user" : "admin"}
										</DropdownMenuItem>

										{/* Ban / Unban */}
										{user.banned ? (
											<DropdownMenuItem onClick={() => onUnbanUser(user.id)} className="flex items-center gap-2 text-green-600">
												<UserCheck className="h-4 w-4" />
												Unban user
											</DropdownMenuItem>
										) : (
											<DropdownMenuItem onClick={() => onBanUser(user.id)} className="flex items-center gap-2 text-red-600">
												<Shield className="h-4 w-4 text-red-600" />
												Ban user
											</DropdownMenuItem>
										)}

										{/* Delete */}
										<DropdownMenuItem onClick={() => onDeleteUser(user.id)} className="flex items-center gap-2 text-red-600">
											<Trash className="h-4 w-4 text-red-600" />
											Delete user
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
