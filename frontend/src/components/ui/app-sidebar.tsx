import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BookOpen, FolderGit2, HomeIcon, Image, Tags, LogOut, User, Users } from "lucide-react";
import kurawalSidebar from "@/assets/kurawal-sidebar.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const items = [
	{
		title: "Dashboard",
		url: "/admin",
		icon: HomeIcon,
	},
	{
		title: "Project",
		url: "/admin/project",
		icon: FolderGit2,
	},
	{
		title: "Posts",
		url: "/admin/posts",
		icon: BookOpen,
	},
	{
		title: "Tags",
		url: "/admin/tags",
		icon: Tags,
	},
	{
		title: "Media",
		url: "/admin/media",
		icon: Image,
	},
	{
		title: "Users",
		url: "/admin/users",
		icon: Users,
	},
	{
		title: "Profile",
		url: "/admin/profile",
		icon: User,
	},
];

export function AppSidebar() {
	const pathname = useLocation().pathname;
	const navigate = useNavigate();
	const data = authClient.useSession();
	const user = data.data?.user;

	const handleLogout = async () => {
		try {
			await authClient.signOut();
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<Sidebar className="mt-4 border-0! pl-4">
			<SidebarMenu>
				<SidebarHeader className="bg-gray-50!">
					<div className="flex items-center gap-2">
						<img src={kurawalSidebar} alt="" className="size-8" />
						<h4 className="text-md font-medium"> Dashboard Kurawal</h4>
					</div>
				</SidebarHeader>
			</SidebarMenu>
			<SidebarContent className="bg-gray-50!">
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton isActive={pathname === item.url} size={"md"} className="" asChild>
										<Link to={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="bg-gray-50!">
				<div className="space-y-3 border-t pt-3">
					{user && (
						<div className="px-2">
							<p className="text-xs text-gray-500">Logged in as</p>
							<p className="text-sm font-medium text-gray-900">{user.email}</p>
						</div>
					)}
					<Button onClick={handleLogout} variant="outline" size="sm" className="w-full justify-start">
						<LogOut className="mr-2 h-4 w-4" />
						Logout
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
