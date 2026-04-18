import { cn } from "@/lib/utils";
import { DecorIcon } from "@/components/ui/decor-icon";
import { Separator } from "@/components/ui/separator";
import { NavUser } from "./NavUser";
import { navLinks, getMostSpecificActivePath } from "./AppShared";
import { CustomSidebarTrigger } from "./CustomSidebarTrigger";
import { AppBreadcrumbs } from "./AppBreadcrumbs";
import { useLocation } from "react-router-dom";

export function AppTopbar() {
	const { pathname } = useLocation();
	const activeItem = getMostSpecificActivePath(pathname, navLinks);
	return (
		<header className={cn("sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6", "bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur-sm")}>
			<DecorIcon className="hidden opacity-40 md:block dark:opacity-30" position="bottom-left" />
			<div className="flex items-center gap-3">
				<CustomSidebarTrigger />
				<Separator className="bg-border mr-2 h-5 data-[orientation=vertical]:self-center" orientation="vertical" />
				<AppBreadcrumbs page={activeItem} />
			</div>
			<div className="flex items-center gap-3">
				<NavUser />
			</div>
		</header>
	);
}
