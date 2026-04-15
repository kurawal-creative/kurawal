import { Outlet } from "react-router-dom";
import Posts from "../features/posts/Posts";
import CreatePost from "../features/posts/CreatePost";
import EditPost from "../features/posts/EditPost";
import AdminLayout from "@/components/layouts/AdminLayout";

export default [
	{
		path: "/admin", // Route induk dengan prefix "/admin"
		element: (
			<AdminLayout>
				<Outlet />
			</AdminLayout>
		), // Outlet untuk render children
		children: [
			{
				path: "posts", // Path relatif: "/admin/posts"
				element: <Posts />,
			},
			{
				path: "create-post", // Path relatif: "/admin/create-post"
				element: <CreatePost />,
			},
			{
				path: "edit-post/:id", // Path relatif: "/admin/edit-post/:id"
				element: <EditPost />,
			},
		],
	},
];
