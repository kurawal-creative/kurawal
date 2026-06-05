import AdminDashboardPage from "@/pages/dashboard";
import AdminPostsPage from "@/pages/dashboard/posts";
import CreatePostPage from "@/pages/dashboard/posts/create";
import EditPostPage from "@/pages/dashboard/posts/edit";
import AdminTagsPage from "@/pages/dashboard/tags";
import AdminMediaPage from "@/pages/dashboard/Media";
import AdminWorksPage from "@/pages/dashboard/works";
import AdminWorksCreatePage from "@/pages/dashboard/works/create/create";
import AdminWorksDetailPage from "@/pages/dashboard/works/detail/detail";
import AdminWorksEditPage from "@/pages/dashboard/works/edit/edit";
import AdminUsersPage from "@/pages/dashboard/users";
import UserProfilePage from "@/pages/dashboard/profile";
import { NuqsAdapter } from "nuqs/adapters/react";

const privateRoutes = [
	{
		path: "/dashboard",
		element: <AdminDashboardPage />,
	},
	{
		path: "/dashboard/posts",
		element: <AdminPostsPage />,
	},
	{
		path: "/dashboard/posts/create",
		element: <CreatePostPage />,
	},
	{
		path: "/dashboard/posts/:id/edit",
		element: <EditPostPage />,
	},
	{
		path: "/dashboard/tags",
		element: <AdminTagsPage />,
	},
	{
		path: "/dashboard/media",
		element: (
			<NuqsAdapter>
				<AdminMediaPage />
			</NuqsAdapter>
		),
	},
	{
		path: "/dashboard/works",
		element: <AdminWorksPage />,
	},
	{
		path: "/dashboard/works/create",
		element: <AdminWorksCreatePage />,
	},
	{
		path: "/dashboard/works/:id",
		element: <AdminWorksDetailPage />,
	},
	{
		path: "/dashboard/works/:id/edit",
		element: <AdminWorksEditPage />,
	},
	{
		path: "/dashboard/users",
		element: <AdminUsersPage />,
	},
	{
		path: "/dashboard/profile",
		element: <UserProfilePage />,
	},
];

export default privateRoutes;
