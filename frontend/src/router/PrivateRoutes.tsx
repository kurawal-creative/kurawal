import AdminDashboardPage from "@/pages/dashboard";
import AdminPostsPage from "@/pages/dashboard/posts";
import CreatePostPage from "@/pages/dashboard/posts/create";
import EditPostPage from "@/pages/dashboard/posts/edit";
import DetailPostPage from "@/pages/dashboard/posts/detail";
import AdminTagsPage from "@/pages/dashboard/tags";
import AdminMediaPage from "@/pages/dashboard/Media";
import AdminWorksPage from "@/pages/dashboard/works";
import AdminWorksCreatePage from "@/pages/dashboard/works/create";
import AdminWorksDetailPage from "@/pages/dashboard/works/detail";
import AdminWorksEditPage from "@/pages/dashboard/works/edit";
import AdminUsersPage from "@/pages/dashboard/users";
import CreateUserPage from "@/pages/dashboard/users/create";
import EditUserPage from "@/pages/dashboard/users/edit";
import DetailUserPage from "@/pages/dashboard/users/detail";
import UserProfilePage from "@/pages/dashboard/profile";
import AdminAwardsPage from "@/pages/dashboard/awards";
import CreateAwardPage from "@/pages/dashboard/awards/create";
import EditAwardPage from "@/pages/dashboard/awards/edit";
import DetailAwardPage from "@/pages/dashboard/awards/detail";
import { NuqsAdapter } from "nuqs/adapters/react";

const privateRoutes = [
	// Dashboard
	{
		path: "/dashboard",
		element: <AdminDashboardPage />,
	},

	// Posts
	{
		path: "/dashboard/posts",
		element: <AdminPostsPage />,
	},
	{
		path: "/dashboard/posts/create",
		element: <CreatePostPage />,
	},
	{
		path: "/dashboard/posts/edit/:id",
		element: <EditPostPage />,
	},
	{
		path: "/dashboard/posts/detail/:id",
		element: <DetailPostPage />,
	},

	// Tags
	{
		path: "/dashboard/tags",
		element: <AdminTagsPage />,
	},

	// Media
	{
		path: "/dashboard/media",
		element: (
			<NuqsAdapter>
				<AdminMediaPage />
			</NuqsAdapter>
		),
	},

	// Works
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

	// Awards
	{
		path: "/dashboard/awards",
		element: <AdminAwardsPage />,
	},
	{
		path: "/dashboard/awards/create",
		element: <CreateAwardPage />,
	},
	{
		path: "/dashboard/awards/edit/:id",
		element: <EditAwardPage />,
	},
	{
		path: "/dashboard/awards/detail/:id",
		element: <DetailAwardPage />,
	},

	// Users
	{
		path: "/dashboard/users",
		element: <AdminUsersPage />,
	},
	{
		path: "/dashboard/users/create",
		element: <CreateUserPage />,
	},
	{
		path: "/dashboard/users/edit/:id",
		element: <EditUserPage />,
	},
	{
		path: "/dashboard/users/detail/:id",
		element: <DetailUserPage />,
	},

	// Profile
	{
		path: "/dashboard/profile",
		element: <UserProfilePage />,
	},
];

export default privateRoutes;
