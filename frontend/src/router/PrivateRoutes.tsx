import Posts from "../features/posts/Posts";
import CreatePost from "../features/posts/CreatePost";
import EditPost from "../features/posts/EditPost";
import Layout from "../layouts/Layout";

export default [
	{
		path: "/posts",
		element: (
			<Layout>
				<Posts />
			</Layout>
		),
	},
	{
		path: "/create-post",
		element: (
			<Layout>
				<CreatePost />
			</Layout>
		),
	},
	{
		path: "/edit-post/:id",
		element: (
			<Layout>
				<EditPost />
			</Layout>
		),
	},
];
