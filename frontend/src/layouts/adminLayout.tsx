import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppTopbar } from "@/components/AppTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider className={cn("[--app-wrapper-max-width:80rem]")}>
			<AppSidebar />
			<SidebarInset>
				<AppTopbar />
				<div className={cn("flex flex-1 flex-col p-4 md:p-6", "mx-auto w-full max-w-(--app-wrapper-max-width)")}>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
