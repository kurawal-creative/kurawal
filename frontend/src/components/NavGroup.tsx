import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import type { SidebarNavGroup, SidebarNavItem } from "@/components/AppShared";
import { getMostSpecificActivePath } from "@/components/AppShared";
import { useLocation } from "react-router-dom";
import { ChevronRightIcon } from "lucide-react";

export function NavGroup({ label, items, allNavItems }: SidebarNavGroup & { allNavItems?: SidebarNavItem[] }) {
	const { pathname } = useLocation();

	// Use all nav items if provided, otherwise flatten current group items
	const itemsToCheck = allNavItems || items.flatMap((item) => (item.subItems?.length ? [item, ...item.subItems] : [item]));

	const mostSpecific = getMostSpecificActivePath(pathname, itemsToCheck);

	const isMostSpecificActive = (itemPath?: string): boolean => {
		return mostSpecific?.path === itemPath;
	};

	return (
		<SidebarGroup>
			{label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible asChild className="group/collapsible" defaultOpen={isMostSpecificActive(item.path) || item.subItems?.some((i) => isMostSpecificActive(i.path))} key={item.title}>
						<SidebarMenuItem>
							{item.subItems?.length ? (
								<>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton isActive={isMostSpecificActive(item.path)}>
											{item.icon}
											<span>{item.title}</span>
											<ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.subItems?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild isActive={isMostSpecificActive(subItem.path)}>
														<a href={subItem.path}>
															{subItem.icon}
															<span>{subItem.title}</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</>
							) : (
								<SidebarMenuButton asChild isActive={isMostSpecificActive(item.path)}>
									<a href={item.path}>
										{item.icon}
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
							)}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
