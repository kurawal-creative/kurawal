import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import AdminLayout from "@/layouts/adminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus } from "lucide-react";

export default function CreateUserPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [newUser, setNewUser] = useState({
		email: "",
		password: "",
		name: "",
		role: "user" as "user" | "admin",
	});

	const handleCreateUser = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (!newUser.name.trim()) {
			toast.error("Name is required");
			return;
		}

		if (!newUser.email.trim()) {
			toast.error("Email is required");
			return;
		}

		if (!newUser.password.trim()) {
			toast.error("Password is required");
			return;
		}

		setLoading(true);

		try {
			await authClient.admin.createUser(newUser);
			toast.success("User created successfully");
			navigate("/dashboard/users");
		} catch (error: any) {
			toast.error(error.message || "Failed to create user");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">Create New User</h1>
						<p className="text-muted-foreground mt-1 text-sm">Add a new user account to the system.</p>
					</div>

					<div className="flex gap-2">
						<Button asChild variant="outline" size="sm">
							<Link to="/dashboard/users">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back
							</Link>
						</Button>

						<Button type="submit" form="user-form" disabled={loading} size="sm">
							<Plus className="mr-2 h-4 w-4" />
							{loading ? "Creating..." : "Create User"}
						</Button>
					</div>
				</div>

				<form id="user-form" onSubmit={handleCreateUser}>
					<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
						<div className="border-b px-6 py-4">
							<h2 className="text-base font-semibold">User Details</h2>
							<p className="text-muted-foreground mt-1 text-sm">Basic information about the user account</p>
						</div>

						<div className="space-y-5 p-6">
							<div className="space-y-2">
								<label htmlFor="name" className="text-sm font-medium">
									Name <span className="text-destructive">*</span>
								</label>
								<Input
									id="name"
									name="name"
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

							<div className="space-y-2">
								<label htmlFor="email" className="text-sm font-medium">
									Email <span className="text-destructive">*</span>
								</label>
								<Input
									id="email"
									name="email"
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

							<div className="space-y-2">
								<label htmlFor="password" className="text-sm font-medium">
									Password <span className="text-destructive">*</span>
								</label>
								<Input
									id="password"
									name="password"
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

							<div className="space-y-2">
								<label htmlFor="role" className="text-sm font-medium">
									Role <span className="text-destructive">*</span>
								</label>
								<Select value={newUser.role} onValueChange={(value: "user" | "admin") => setNewUser({ ...newUser, role: value })}>
									<SelectTrigger id="role" className="w-full">
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="user">User</SelectItem>
										<SelectItem value="admin">Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</form>
			</div>
		</AdminLayout>
	);
}
