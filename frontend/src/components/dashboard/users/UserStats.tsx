import { Users, Shield, UserCheck, ShieldAlert } from "lucide-react";

interface UserStatsProps {
	totalUsers: number;
	adminUsers: number;
	activeUsers: number;
	bannedUsers: number;
}

export function UserStats({ totalUsers, adminUsers, activeUsers, bannedUsers }: UserStatsProps) {
	return (
		<div className="grid gap-3 md:grid-cols-4">
			<div className="bg-card flex items-center justify-between rounded-xl border p-4">
				<div>
					<p className="text-muted-foreground text-xs font-medium">Total Users</p>
					<p className="mt-1 text-2xl font-bold">{totalUsers}</p>
				</div>
				<div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-lg">
					<Users className="text-primary h-5 w-5" />
				</div>
			</div>

			<div className="bg-card flex items-center justify-between rounded-xl border p-4">
				<div>
					<p className="text-muted-foreground text-xs font-medium">Admins</p>
					<p className="mt-1 text-2xl font-bold">{adminUsers}</p>
				</div>
				<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/10">
					<Shield className="h-5 w-5 text-purple-600" />
				</div>
			</div>

			<div className="bg-card flex items-center justify-between rounded-xl border p-4">
				<div>
					<p className="text-muted-foreground text-xs font-medium">Active</p>
					<p className="mt-1 text-2xl font-bold">{activeUsers}</p>
				</div>
				<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
					<UserCheck className="h-5 w-5 text-emerald-600" />
				</div>
			</div>

			<div className="bg-card flex items-center justify-between rounded-xl border p-4">
				<div>
					<p className="text-muted-foreground text-xs font-medium">Banned</p>
					<p className="mt-1 text-2xl font-bold">{bannedUsers}</p>
				</div>
				<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500/10">
					<ShieldAlert className="h-5 w-5 text-red-600" />
				</div>
			</div>
		</div>
	);
}
