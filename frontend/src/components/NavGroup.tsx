import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import type { SidebarNavGroup, SidebarNavItem } from "@/components/AppShared";
import { getMostSpecificActivePath } from "@/components/AppShared";
import { Link, useLocation } from "react-router-dom";
import { ChevronRightIcon } from "lucide-react";

export function NavGroup({ label, items, allNavItems }: SidebarNavGroup & { allNavItems?: SidebarNavItem[] }) {
	const { pathname } = useLocation();

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
					<Collapsible key={item.title} asChild className="group/collapsible" defaultOpen={isMostSpecificActive(item.path) || item.subItems?.some((i) => isMostSpecificActive(i.path))}>
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
											{item.subItems.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													{subItem.path && (
														<SidebarMenuSubButton asChild isActive={isMostSpecificActive(subItem.path)}>
															<Link to={subItem.path}>
																{subItem.icon}
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													)}
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</>
							) : (
								item.path && (
									<SidebarMenuButton asChild isActive={isMostSpecificActive(item.path)}>
										<Link to={item.path}>
											{item.icon}
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								)
							)}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
