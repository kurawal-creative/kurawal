import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import AdminLayout from "@/layouts/adminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Filter, ArrowUpDown, MoreHorizontal, Users, Shield, UserCheck, Trash2, Eye, Edit, UserCog, ShieldAlert } from "lucide-react";

type User = {
	id: string;
	email: string;
	name: string;
	role: string;
	banned?: boolean;
	banReason?: string;
	createdAt: Date;
};

export default function AdminUsersPage() {
	const navigate = useNavigate();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const res = await authClient.admin.listUsers({
				query: { limit: 100 },
			});

			if (res.error) {
				if (res.error.status === 403) {
					toast.error("Akses ditolak. Akun kamu belum memiliki role admin.");
					return;
				}

				toast.error("FAILED TO FETCH USERS: " + (res.error.message ?? "Unknown error"));
				return;
			}

			if (res.data) {
				setUsers(res.data.users as User[]);
			}
		} catch (error: any) {
			const status = error?.status ?? error?.response?.status;

			if (status === 403) {
				toast.error("Akses ditolak. Akun kamu belum memiliki role admin.");
				return;
			}

			toast.error("FAILED TO FETCH USERS: " + (error?.message ?? "Unknown error"));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleBanUser = async (userId: string) => {
		const reason = window.prompt("Enter ban reason:");
		if (reason === null) return;

		try {
			await authClient.admin.banUser({
				userId,
				banReason: reason,
			});

			toast.success("USER BANNED");
			fetchUsers();
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	const handleUnbanUser = async (userId: string) => {
		try {
			await authClient.admin.unbanUser({ userId });
			toast.success("USER UNBANNED");
			fetchUsers();
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	const handleDeleteUser = async (userId: string) => {
		if (!window.confirm("Are you sure you want to delete this user?")) return;

		try {
			await authClient.admin.removeUser({ userId });
			toast.success("USER REMOVED");
			fetchUsers();
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	const handleSetRole = async (userId: string, currentRole: string) => {
		const newRole = currentRole === "admin" ? "user" : "admin";

		try {
			await authClient.admin.setRole({
				userId,
				role: newRole,
			});

			toast.success(`ROLE UPDATED TO ${newRole.toUpperCase()}`);
			fetchUsers();
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	const filteredUsers = users.filter((user) => {
		const searchLower = searchTerm.toLowerCase();
		return user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower) || user.id.toLowerCase().includes(searchLower);
	});

	const getUserStats = () => {
		const totalUsers = users.length;
		const adminUsers = users.filter((u) => u.role === "admin").length;
		const activeUsers = users.filter((u) => !u.banned).length;
		const bannedUsers = users.filter((u) => u.banned).length;
		return { totalUsers, adminUsers, activeUsers, bannedUsers };
	};

	const stats = getUserStats();

	return (
		<AdminLayout>
			<div className="space-y-5">
				{/* Header */}
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
						<p className="text-muted-foreground mt-1 text-sm">Manage users, roles, and permissions across the platform.</p>
					</div>

					<Button onClick={() => navigate("/dashboard/users/create")}>
						<Plus />
						Create User
					</Button>
				</div>

				{/* Stats */}
				<div className="grid gap-3 md:grid-cols-4">
					<div className="bg-card flex items-center justify-between rounded-xl border p-4">
						<div>
							<p className="text-muted-foreground text-xs font-medium">Total Users</p>
							<p className="mt-1 text-2xl font-bold">{stats.totalUsers}</p>
						</div>

						<div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-lg">
							<Users className="text-primary h-5 w-5" />
						</div>
					</div>

					<div className="bg-card flex items-center justify-between rounded-xl border p-4">
						<div>
							<p className="text-muted-foreground text-xs font-medium">Admins</p>
							<p className="mt-1 text-2xl font-bold">{stats.adminUsers}</p>
						</div>

						<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/10">
							<Shield className="h-5 w-5 text-purple-600" />
						</div>
					</div>

					<div className="bg-card flex items-center justify-between rounded-xl border p-4">
						<div>
							<p className="text-muted-foreground text-xs font-medium">Active</p>
							<p className="mt-1 text-2xl font-bold">{stats.activeUsers}</p>
						</div>

						<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
							<UserCheck className="h-5 w-5 text-emerald-600" />
						</div>
					</div>

					<div className="bg-card flex items-center justify-between rounded-xl border p-4">
						<div>
							<p className="text-muted-foreground text-xs font-medium">Banned</p>
							<p className="mt-1 text-2xl font-bold">{stats.bannedUsers}</p>
						</div>

						<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500/10">
							<ShieldAlert className="h-5 w-5 text-red-600" />
						</div>
					</div>
				</div>

				<div className="bg-card rounded-xl border">
					{/* Toolbar */}
					<div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex items-center gap-2">
							<div className="relative w-full lg:w-92">
								<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
								<Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." className="h-9 pl-9" />
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

					{/* Table */}
					{loading ? (
						<div className="space-y-3 p-6">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="flex items-center gap-4">
									<Skeleton className="h-12 w-12 rounded-full" />
									<Skeleton className="h-4 flex-1" />
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-4 w-24" />
								</div>
							))}
						</div>
					) : filteredUsers.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-10">
							<div className="bg-muted/50 mb-3 flex h-14 w-14 items-center justify-center rounded-full">
								<Users className="text-muted-foreground h-7 w-7" />
							</div>

							<p className="text-sm font-medium">No users found</p>

							<p className="text-muted-foreground mt-1 text-xs">Try changing the search term or create a new user.</p>
						</div>
					) : (
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
								{filteredUsers.map((user, index) => (
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

													<DropdownMenuItem onClick={() => handleSetRole(user.id, user.role)}>
														<UserCog className="mr-2 h-4 w-4" />
														Set as {user.role === "admin" ? "User" : "Admin"}
													</DropdownMenuItem>

													<DropdownMenuSeparator />

													{user.banned ? (
														<DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
															<UserCheck className="mr-2 h-4 w-4" />
															Unban User
														</DropdownMenuItem>
													) : (
														<DropdownMenuItem onClick={() => handleBanUser(user.id)}>
															<ShieldAlert className="mr-2 h-4 w-4" />
															Ban User
														</DropdownMenuItem>
													)}

													<DropdownMenuSeparator />

													<DropdownMenuItem variant="destructive" onClick={() => handleDeleteUser(user.id)}>
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
					)}
				</div>
			</div>
		</AdminLayout>
	);
}
