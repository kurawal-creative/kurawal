"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";

const defaultUser = {
	name: "User",
	email: "user@example.com",
	avatar: "",
};

export function NavUser() {
	const navigate = useNavigate();
	const { data: session } = authClient.useSession();

	const user = {
		name: session?.user?.name || defaultUser.name,
		email: session?.user?.email || defaultUser.email,
		avatar: session?.user?.image || defaultUser.avatar,
	};

	const handleLogout = async () => {
		try {
			await authClient.signOut();
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="size-9.5 cursor-pointer">
					<AvatarImage src={user.avatar} alt={user.name} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-60">
				<DropdownMenuItem className="flex items-center justify-start gap-2">
					<DropdownMenuLabel className="flex items-center gap-3">
						<Avatar className="size-10">
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
						<div>
							<span className="text-foreground font-medium">{user.name}</span> <br />
							<div className="text-muted-foreground max-w-full overflow-hidden text-xs text-ellipsis whitespace-nowrap">{user.email}</div>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<UserIcon />
						Account
					</DropdownMenuItem>
					<DropdownMenuItem>
						<SettingsIcon />
						Settings
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="w-full cursor-pointer" variant="destructive" onClick={handleLogout}>
						<LogOutIcon />
						Log out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
