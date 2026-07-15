import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import AdminLayout from "@/layouts/adminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UsersTable, User } from "@/components/dashboard/users/UsersTable";
import { UserStats } from "@/components/dashboard/users/UserStats";
import { UserToolbar } from "@/components/dashboard/users/UserToolbar";
import { UsersEmptyState } from "@/components/dashboard/users/UsersEmptyState";
import { UsersTableSkeleton } from "@/components/dashboard/users/UsersTableSkeleton";

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
			await authClient.admin.banUser({ userId, banReason: reason });
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
			await authClient.admin.setRole({ userId, role: newRole });
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

				<UserStats totalUsers={stats.totalUsers} adminUsers={stats.adminUsers} activeUsers={stats.activeUsers} bannedUsers={stats.bannedUsers} />

				<div className="bg-card rounded-xl border">
					<UserToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

					{loading ? (
						<UsersTableSkeleton />
					) : filteredUsers.length === 0 ? (
						<UsersEmptyState />
					) : (
						<UsersTable users={filteredUsers} onBanUser={handleBanUser} onUnbanUser={handleUnbanUser} onDeleteUser={handleDeleteUser} onSetRole={handleSetRole} />
					)}
				</div>
			</div>
		</AdminLayout>
	);
}
