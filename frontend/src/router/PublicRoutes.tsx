import Home from "@/pages/client";
import Login from "@/pages/auth/Login";
import ContactUsPage from "@/pages/client/contact-us";
import WorksPage from "@/pages/client/works";
import Layout from "@/layouts/layout";
import BlogsPage from "@/pages/client/blogs";
import BlogDetailPage from "@/pages/client/blogs/[id]";
import ServicesPage from "@/pages/client/services";

export default [
	{
		path: "/",
		element: (
			<Layout>
				<Home />
			</Layout>
		),
	},

	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/works",
		element: (
			<Layout>
				<WorksPage />
			</Layout>
		),
	},
	{
		path: "/blogs",
		element: (
			<Layout>
				<BlogsPage />
			</Layout>
		),
	},
	{
		path: "/blogs/:id",
		element: (
			<Layout>
				<BlogDetailPage />
			</Layout>
		),
	},
	{
		path: "/services",
		element: (
			<Layout>
				<ServicesPage />
			</Layout>
		),
	},
	// {
	// 	path: "/about-us",
	// 	element: (
	// 		<Layout>
	// 			<AboutUsPage />
	// 		</Layout>
	// 	),
	// },
	{
		path: "/contact-us",
		element: (
			<Layout>
				<ContactUsPage />
			</Layout>
		),
	},
];
