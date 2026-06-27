import { DashboardUpdates } from "./DashboardUpdates";
import { VisitorChart } from "./DashboardVisitChart";
import { DashboardStats } from "./DashboardStats";
import { authClient } from "@/lib/auth-client";


export function Dashboard() {
	const { data: session } = authClient.useSession();
	const userName = session?.user?.name || "User";

	return (
		<div className="flex flex-1 flex-col gap-6 py-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-semibold text-xl leading-tight">
					Welcome back, {userName}!
				</h1>
				<p className="text-base text-muted-foreground">
					let's get things done.
				</p>
			</div>
			<div className="rounded-lg overflow-hidden border">
				<div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-3">
					<DashboardStats />
					<VisitorChart />
					<DashboardUpdates />
				</div>
			</div>
		</div>
	);
}
