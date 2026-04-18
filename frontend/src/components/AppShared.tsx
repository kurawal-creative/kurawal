import type { ReactNode } from "react";
import { LayoutGridIcon, FolderGit2Icon, BookOpenIcon, TagsIcon, UsersIcon, UserIcon, LogOutIcon, HelpCircleIcon } from "lucide-react";

export const isPathActive = (currentPath: string, itemPath?: string): boolean => {
	if (!itemPath) return false;
	return currentPath === itemPath || currentPath.startsWith(itemPath + "/");
};

export const getMostSpecificActivePath = (currentPath: string, items: SidebarNavItem[]): SidebarNavItem | undefined => {
	return items.filter((item) => isPathActive(currentPath, item.path)).sort((a, b) => (b.path?.length || 0) - (a.path?.length || 0))[0];
};

export const isPathMostSpecificActive = (currentPath: string, itemPath?: string, allItems?: SidebarNavItem[]): boolean => {
	if (!itemPath || !allItems) return false;
	const mostSpecific = getMostSpecificActivePath(currentPath, allItems);
	return mostSpecific?.path === itemPath;
};

export type SidebarNavItem = {
	title: string;
	path?: string;
	icon?: ReactNode;
	isActive?: boolean;
	subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
	{
		label: "Overview",
		items: [
			{
				title: "Dashboard",
				path: "/admin",
				icon: <LayoutGridIcon />,
			},
		],
	},
	{
		label: "Content Management",
		items: [
			{
				title: "Projects",
				path: "/admin/project",
				icon: <FolderGit2Icon />,
			},
			{
				title: "Posts",
				path: "/admin/posts",
				icon: <BookOpenIcon />,
			},
			{
				title: "Tags",
				path: "/admin/tags",
				icon: <TagsIcon />,
			},
		],
	},
	{
		label: "User Management",
		items: [
			{
				title: "Users",
				path: "/admin/users",
				icon: <UsersIcon />,
			},
			{
				title: "Profile",
				path: "/admin/profile",
				icon: <UserIcon />,
			},
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [
	{
		title: "Help Center",
		path: "/help",
		icon: <HelpCircleIcon />,
	},
	{
		title: "Logout",
		icon: <LogOutIcon />,
	},
];

export const navLinks: SidebarNavItem[] = [...navGroups.flatMap((group) => group.items.flatMap((item) => (item.subItems?.length ? [item, ...item.subItems] : [item]))), ...footerNavLinks];
