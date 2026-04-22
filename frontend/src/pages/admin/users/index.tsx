import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import AdminLayout from "@/layouts/adminLayout";
import TableUsers from "@/components/TableUsers";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

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
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [showCreateModal, setShowCreateModal] = useState(false);

	const [newUser, setNewUser] = useState({
		email: "",
		password: "",
		name: "",
		role: "user" as "user" | "admin",
	});

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

	const handleCreateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await authClient.admin.createUser(newUser);
			toast.success("USER CREATED");

			setShowCreateModal(false);
			setNewUser({
				email: "",
				password: "",
				name: "",
				role: "user",
			});

			fetchUsers();
		} catch (error: any) {
			toast.error(error.message);
		}
	};

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

	return (
		<AdminLayout>
			<div className="w-full space-y-6">
				{/* Header */}
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
						<p className="text-muted-foreground text-sm">Manage users, roles, and permissions</p>
					</div>

					<Button onClick={() => setShowCreateModal(true)} className="gap-2">
						<Plus className="h-4 w-4" />
						Create User
					</Button>
				</div>

				{/* Table */}
				<TableUsers users={users} loading={loading} onBanUser={handleBanUser} onUnbanUser={handleUnbanUser} onDeleteUser={handleDeleteUser} onSetRole={handleSetRole} />

				{/* Dialog */}
				<Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Create New User</DialogTitle>
							<DialogDescription>Fill in the details to create a new user account.</DialogDescription>
						</DialogHeader>

						<form onSubmit={handleCreateUser} className="space-y-4">
							<div className="space-y-1">
								<Label>Name</Label>
								<Input
									required
									placeholder="John Doe"
									value={newUser.name}
									onChange={(e) =>
										setNewUser({
											...newUser,
											name: e.target.value,
										})
									}
								/>
							</div>

							<div className="space-y-1">
								<Label>Email</Label>
								<Input
									type="email"
									required
									placeholder="user@example.com"
									value={newUser.email}
									onChange={(e) =>
										setNewUser({
											...newUser,
											email: e.target.value,
										})
									}
								/>
							</div>

							<div className="space-y-1">
								<Label>Password</Label>
								<Input
									type="password"
									required
									placeholder="••••••••"
									value={newUser.password}
									onChange={(e) =>
										setNewUser({
											...newUser,
											password: e.target.value,
										})
									}
								/>
							</div>

							<div className="space-y-1">
								<Label>Role</Label>
								<Select value={newUser.role} onValueChange={(value: "user" | "admin") => setNewUser({ ...newUser, role: value })}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="user">User</SelectItem>
										<SelectItem value="admin">Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex gap-2 pt-4">
								<Button type="submit" className="flex-1 gap-2">
									<Plus className="h-4 w-4" />
									Create
								</Button>

								<Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
									Cancel
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</AdminLayout>
	);
}
