import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import AdminLayout from "@/layouts/adminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Mail, User, Calendar, Shield, ShieldAlert, UserCheck } from "lucide-react";

type User = {
	id: string;
	email: string;
	name: string;
	role: string;
	banned?: boolean;
	banReason?: string;
	createdAt: Date;
};

export default function DetailUserPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
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
			<div className="space-y-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">User Details</h1>
						<p className="text-muted-foreground mt-1 text-sm">View detailed information about this user.</p>
					</div>

					<div className="flex gap-2">
						<Button asChild variant="outline" size="sm">
							<Link to="/dashboard/users">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back
							</Link>
						</Button>

						<Button onClick={() => navigate(`/dashboard/users/edit/${user.id}`)} size="sm">
							<Edit className="mr-2 h-4 w-4" />
							Edit User
						</Button>
					</div>
				</div>

				<div className="space-y-6">
					{/* User Profile Section */}
					<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
						<div className="border-b px-6 py-4">
							<h2 className="text-base font-semibold">User Profile</h2>
							<p className="text-muted-foreground mt-1 text-sm">Basic information about the user account</p>
						</div>

						<div className="space-y-5 p-6">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-4">
									<div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
										<User className="text-primary h-8 w-8" />
									</div>

									<div>
										<h3 className="text-xl font-semibold">{user.name}</h3>
										<p className="text-muted-foreground mt-1 text-sm">{user.email}</p>
									</div>
								</div>

								<div className="flex flex-col items-end gap-2">
									<Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
										{user.role}
									</Badge>

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
							</div>
						</div>
					</div>

					{/* Account Information Section */}
					<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
						<div className="border-b px-6 py-4">
							<h2 className="text-base font-semibold">Account Information</h2>
							<p className="text-muted-foreground mt-1 text-sm">Detailed account information and metadata</p>
						</div>

						<div className="space-y-5 p-6">
							<div className="space-y-2">
								<label className="text-sm font-medium">User ID</label>
								<div className="bg-muted/50 rounded-lg border px-3 py-2">
									<p className="font-mono text-sm">{user.id}</p>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Email Address</label>
								<div className="flex items-center gap-3 rounded-lg border px-3 py-2">
									<Mail className="text-muted-foreground h-4 w-4" />
									<p className="text-sm">{user.email}</p>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Account Role</label>
								<div className="flex items-center gap-3 rounded-lg border px-3 py-2">
									<Shield className="text-muted-foreground h-4 w-4" />
									<Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
										{user.role}
									</Badge>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Account Created</label>
								<div className="flex items-center gap-3 rounded-lg border px-3 py-2">
									<Calendar className="text-muted-foreground h-4 w-4" />
									<p className="text-sm">{new Date(user.createdAt).toLocaleString()}</p>
								</div>
							</div>

							{user.banned && (
								<div className="space-y-2">
									<label className="text-sm font-medium text-red-600">Ban Status</label>
									<div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-500/5 px-3 py-2">
										<ShieldAlert className="h-4 w-4 text-red-600" />
										<div className="flex-1">
											<p className="text-sm font-medium text-red-600">Account Banned</p>
											<p className="text-muted-foreground mt-1 text-sm">{user.banReason || "No reason provided"}</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
