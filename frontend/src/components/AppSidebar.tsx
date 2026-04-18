import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import kurawalSidebar from "@/assets/kurawal-sidebar.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { NavGroup } from "./NavGroup";
import { footerNavLinks, navGroups, getMostSpecificActivePath, type SidebarNavItem } from "./AppShared";
import { cn } from "@/lib/utils";
import { LatestChange } from "./LatestChange";

export function AppSidebar() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const mostSpecificFooter = getMostSpecificActivePath(pathname, footerNavLinks);

	// Flatten all nav items from all groups for global comparison
	const allNavItems: SidebarNavItem[] = navGroups.flatMap((group) => group.items.flatMap((item) => (item.subItems?.length ? [item, ...item.subItems] : [item])));

	const handleLogout = async () => {
		try {
			await authClient.signOut();
			navigate("/");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<Sidebar className={cn("*:data-[slot=sidebar-inner]:bg-background", "*:data-[slot=sidebar-inner]:dark:bg-[radial-gradient(60%_18%_at_10%_0%,--theme(--color-foreground/.08),transparent)]", "**:data-[slot=sidebar-menu-button]:[&>span]:text-foreground/75")} collapsible="icon" variant="sidebar">
			{/* Header */}
			<SidebarHeader className="h-14 justify-center border-b px-2">
				<SidebarMenuButton asChild>
					<a href="/admin">
						<img src={kurawalSidebar} alt="" className="size-8" /> <h4 className="text-md font-medium"> Dashboard Kurawal</h4>
					</a>
				</SidebarMenuButton>
			</SidebarHeader>
			{/* Content */}
			<SidebarContent className="bg-gray-50!">
				{navGroups.map((group, index) => (
					<NavGroup key={`sidebar-group-${index}`} {...group} allNavItems={allNavItems} />
				))}
			</SidebarContent>
			{/* Footer */}
			<SidebarFooter className="gap-0 p-0">
				<LatestChange />
				<SidebarMenu className="border-t p-2">
					{footerNavLinks.map((item) => (
						<SidebarMenuItem key={item.title}>
							{item.path ? (
								<SidebarMenuButton asChild className="text-muted-foreground" isActive={mostSpecificFooter?.path === item.path} size="sm">
									<a href={item.path}>
										{item.icon}
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
							) : (
								<SidebarMenuButton className="text-muted-foreground" size="sm" type="button" onClick={handleLogout}>
									{item.icon}
									<span>{item.title}</span>
								</SidebarMenuButton>
							)}
						</SidebarMenuItem>
					))}
				</SidebarMenu>
				<div className="px-4 pt-4 pb-2 transition-opacity group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0">
					<p className="text-muted-foreground text-[9px] text-nowrap">© {new Date().getFullYear()} Kurawal Creative</p>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
