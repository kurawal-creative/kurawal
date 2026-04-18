import { type ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../ui/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Link } from "react-router-dom";
import { userBreadcrumbs } from "@/utils/generateBreadcrumbs";
export default function AdminLayout(props: { children: ReactNode }) {
	const routes = {
		"/": "Home",
		"/admin": "Admin",
		"/admin/project": "Project",
		"/posts": "Posts",
		"/create-post": "Create Post",
		"/edit-post": "Edit Post",
	};

	const breadcrumbs = userBreadcrumbs(routes);
	return (
		// <>
		// 	{/* content */}
		// 	<div className="fixed top-0 left-0 h-screen w-screen border-b bg-white pt-16 pl-0 md:pl-64">
		// 		<div className="p-6">{props.children}</div>
		// 	</div>
		// 	{/* Sidebar */}
		// 	<div className={`fixed top-0 left-0 h-screen w-64 bg-amber-100 duration-700 ${!isSidebarOpen ? "-translate-x-full" : "translate-x-0"} border-r pt-16 md:flex! md:translate-x-0`}>
		// 		<h1 className="text-black">Kurawal</h1>
		// 	</div>

		// 	<header>
		// 		<nav>Hallo</nav>
		// 	</header>
		// 	<footer>Footer</footer>
		// </>
		<>
			<SidebarProvider className="bg-gray-50!">
				<AppSidebar />
				<main className="mt-2 mr-2 mb-2 flex min-w-0 flex-1 flex-col rounded-xl border-[0.5px] bg-white shadow-xs">
					{/* Header */}
					<div className="sticky top-0 flex h-16 shrink-0 items-center gap-2 rounded-xl bg-white/50 px-6 backdrop-blur-lg">
						<SidebarTrigger />
						<Breadcrumb>
							<BreadcrumbList>
								{breadcrumbs.map((breadcrumb, index) => (
									<>
										<BreadcrumbItem key={breadcrumb.path}>
											<BreadcrumbLink asChild>
												<Link to={breadcrumb.path}>{breadcrumb.label}</Link>
											</BreadcrumbLink>
										</BreadcrumbItem>
										{index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
									</>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<div className="min-w-0 px-8 pb-8">{props.children}</div>
				</main>
			</SidebarProvider>
		</>
	);
}
