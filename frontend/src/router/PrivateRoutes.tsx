import Posts from "../pages/client/posts/Posts";
import CreatePost from "../pages/client/posts/CreatePost";
import EditPost from "../pages/client/posts/EditPost";
// import Layout from "../layouts/layout";

export default [
	{
		path: "/posts",
		element: (
			// <Layout>
			<Posts />
			// </Layout>
		),
	},
	{
		path: "/create-post",
		element: (
			// <Layout>
			<CreatePost />
			// </Layout>
		),
	},
	{
		path: "/edit-post/:id",
		element: (
			//<Layout>
			<EditPost />
			// </Layout>
		),
	},
];
