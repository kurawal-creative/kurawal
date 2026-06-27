import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import AdminLayout from "@/layouts/adminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, ShieldAlert, UserCheck, Trash2 } from "lucide-react";

type User = {
	id: string;
	email: string;
	name: string;
	role: string;
	banned?: boolean;
	banReason?: string;
	createdAt: Date;
};

export default function EditUserPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		fetchUser();
	}, [id]);

	const fetchUser = async () => {
		if (!id) return;

		setLoading(true);
		try {
			const res = await authClient.admin.listUsers({
				query: { limit: 100 },
			});

			if (res.error) {
				toast.error("FAILED TO FETCH USER: " + (res.error.message ?? "Unknown error"));
				navigate("/dashboard/users");
				return;
			}

			if (res.data) {
				const foundUser = res.data.users.find((u: any) => u.id === id);
				if (foundUser) {
					setUser(foundUser as User);
				} else {
					toast.error("User not found");
					navigate("/dashboard/users");
				}
			}
		} catch (error: any) {
			toast.error("FAILED TO FETCH USER: " + (error?.message ?? "Unknown error"));
			navigate("/dashboard/users");
		} finally {
			setLoading(false);
		}
	};

	const handleSetRole = async () => {
		if (!user) return;

		setSaving(true);
		const newRole = user.role === "admin" ? "user" : "admin";

		try {
			await authClient.admin.setRole({
				userId: user.id,
				role: newRole,
			});

			toast.success(`ROLE UPDATED TO ${newRole.toUpperCase()}`);
			setUser({ ...user, role: newRole });
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setSaving(false);
		}
	};

	const handleBanUser = async () => {
		if (!user) return;

		const reason = window.prompt("Enter ban reason:");
		if (reason === null) return;

		setSaving(true);
		try {
			await authClient.admin.banUser({
				userId: user.id,
				banReason: reason,
			});

			toast.success("USER BANNED");
			setUser({ ...user, banned: true, banReason: reason });
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setSaving(false);
		}
	};

	const handleUnbanUser = async () => {
		if (!user) return;

		setSaving(true);
		try {
			await authClient.admin.unbanUser({ userId: user.id });
			toast.success("USER UNBANNED");
			setUser({ ...user, banned: false, banReason: undefined });
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setSaving(false);
		}
	};

	const handleDeleteUser = async () => {
		if (!user) return;
		if (!window.confirm("Are you sure you want to delete this user?")) return;

		setSaving(true);
		try {
			await authClient.admin.removeUser({ userId: user.id });
			toast.success("USER REMOVED");
			navigate("/dashboard/users");
		} catch (error: any) {
			toast.error(error.message);
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="space-y-5">
					<div className="flex items-center gap-4">
						<Skeleton className="h-10 w-10" />
						<div className="space-y-2">
							<Skeleton className="h-8 w-64" />
							<Skeleton className="h-4 w-96" />
						</div>
					</div>
					<div className="bg-card max-w-2xl space-y-4 rounded-xl border p-6">
						<Skeleton className="h-20" />
						<Skeleton className="h-20" />
						<Skeleton className="h-20" />
					</div>
				</div>
			</AdminLayout>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<AdminLayout>
			<div className="space-y-5">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/users")}>
						<ArrowLeft className="h-5 w-5" />
					</Button>

					<div>
						<h1 className="text-2xl font-semibold tracking-tight">Edit User</h1>
						<p className="text-muted-foreground mt-1 text-sm">Manage user role, status, and permissions.</p>
					</div>
				</div>

				<div className="bg-card max-w-2xl space-y-6 rounded-xl border p-6">
					{/* User Info */}
					<div className="space-y-4">
						<div className="space-y-1">
							<Label>User ID</Label>
							<Input value={user.id} disabled className="font-mono" />
						</div>

						<div className="space-y-1">
							<Label>Name</Label>
							<Input value={user.name} disabled />
						</div>

						<div className="space-y-1">
							<Label>Email</Label>
							<Input value={user.email} disabled />
						</div>

						<div className="space-y-1">
							<Label>Created At</Label>
							<Input value={new Date(user.createdAt).toLocaleString()} disabled />
						</div>
					</div>

					<div className="border-t pt-6">
						<h3 className="mb-4 text-lg font-semibold">User Management</h3>

						<div className="space-y-4">
							{/* Role Management */}
							<div className="bg-muted/30 flex items-center justify-between rounded-lg border p-4">
								<div className="space-y-1">
									<Label>Current Role</Label>
									<div className="flex items-center gap-2">
										<Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
											{user.role}
										</Badge>
									</div>
								</div>

								<Button onClick={handleSetRole} disabled={saving} variant="outline">
									Set as {user.role === "admin" ? "User" : "Admin"}
								</Button>
							</div>

							{/* Ban Status */}
							<div className="bg-muted/30 flex items-center justify-between rounded-lg border p-4">
								<div className="space-y-1">
									<Label>Account Status</Label>
									<div className="flex items-center gap-2">
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
									</div>
									{user.banned && user.banReason && <p className="text-muted-foreground text-xs">Reason: {user.banReason}</p>}
								</div>

								{user.banned ? (
									<Button onClick={handleUnbanUser} disabled={saving} variant="outline">
										<UserCheck className="mr-2 h-4 w-4" />
										Unban User
									</Button>
								) : (
									<Button onClick={handleBanUser} disabled={saving} variant="outline">
										<ShieldAlert className="mr-2 h-4 w-4" />
										Ban User
									</Button>
								)}
							</div>
						</div>
					</div>

					{/* Danger Zone */}
					<div className="border-t pt-6">
						<h3 className="mb-4 text-lg font-semibold text-red-600">Danger Zone</h3>
						<div className="bg-red-500/5 flex items-center justify-between rounded-lg border border-red-200 p-4">
							<div className="space-y-1">
								<Label className="text-red-600">Delete User</Label>
								<p className="text-muted-foreground text-xs">This action cannot be undone. This will permanently delete the user account.</p>
							</div>

							<Button onClick={handleDeleteUser} disabled={saving} variant="destructive">
								<Trash2 className="mr-2 h-4 w-4" />
								Delete User
							</Button>
						</div>
					</div>

					<div className="flex gap-2 pt-4">
						<Button onClick={() => navigate("/dashboard/users")} variant="outline" className="flex-1">
							Back to Users
						</Button>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
