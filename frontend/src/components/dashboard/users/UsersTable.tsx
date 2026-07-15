import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, UserCog, Trash2, ShieldAlert, UserCheck } from "lucide-react";

export type User = {
	id: string;
	email: string;
	name: string;
	role: string;
	banned?: boolean;
	banReason?: string;
	createdAt: Date;
};

interface UsersTableProps {
	users: User[];
	onBanUser: (userId: string) => void;
	onUnbanUser: (userId: string) => void;
	onDeleteUser: (userId: string) => void;
	onSetRole: (userId: string, currentRole: string) => void;
}

export function UsersTable({ users, onBanUser, onUnbanUser, onDeleteUser, onSetRole }: UsersTableProps) {
	const navigate = useNavigate();

	return (
		<Table>
			<TableHeader>
				<TableRow className="bg-muted/30 hover:bg-muted/30">
					<TableHead className="w-14">No.</TableHead>
					<TableHead>User</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="w-14">Actions</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{users.map((user, index) => (
					<TableRow key={user.id} className="group">
						<TableCell className="text-muted-foreground">{index + 1}</TableCell>

						<TableCell>
							<div className="flex items-center gap-3">
								<div>
									<p className="font-medium">{user.name}</p>
									<p className="text-muted-foreground font-mono text-xs">{user.id.slice(0, 8)}</p>
								</div>
							</div>
						</TableCell>

						<TableCell className="text-muted-foreground">{user.email}</TableCell>

						<TableCell>
							<Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
								{user.role}
							</Badge>
						</TableCell>

						<TableCell>
							{user.banned ? (
								<Badge variant="destructive" className="gap-1">
									<ShieldAlert className="h-3 w-3" />
									Banned
								</Badge>
							) : (
								<Badge className="gap-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
									<UserCheck className="h-3 w-3" />
									Active
								</Badge>
							)}
						</TableCell>

						<TableCell>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => navigate(`/dashboard/users/detail/${user.id}`)}>
										<Eye className="mr-2 h-4 w-4" />
										View
									</DropdownMenuItem>

									<DropdownMenuItem onClick={() => navigate(`/dashboard/users/edit/${user.id}`)}>
										<Edit className="mr-2 h-4 w-4" />
										Edit
									</DropdownMenuItem>

									<DropdownMenuSeparator />

									<DropdownMenuItem onClick={() => onSetRole(user.id, user.role)}>
										<UserCog className="mr-2 h-4 w-4" />
										Set as {user.role === "admin" ? "User" : "Admin"}
									</DropdownMenuItem>

									<DropdownMenuSeparator />

									{user.banned ? (
										<DropdownMenuItem onClick={() => onUnbanUser(user.id)}>
											<UserCheck className="mr-2 h-4 w-4" />
											Unban User
										</DropdownMenuItem>
									) : (
										<DropdownMenuItem onClick={() => onBanUser(user.id)}>
											<ShieldAlert className="mr-2 h-4 w-4" />
											Ban User
										</DropdownMenuItem>
									)}

									<DropdownMenuSeparator />

									<DropdownMenuItem variant="destructive" onClick={() => onDeleteUser(user.id)}>
										<Trash2 className="mr-2 h-4 w-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
