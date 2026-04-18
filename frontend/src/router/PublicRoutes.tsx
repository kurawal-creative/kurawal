import Home from "@/pages/client/home/Home";
import Login from "@/pages/client/auth/Login";
import AboutUsPage from "@/pages/client/about-us/AboutUsPage";
import ContactUsPage from "@/pages/client/contact-us/ContactUsPage";
import WorksPage from "@/pages/client/works/WorksPage";
import Layout from "@/layouts/layout";
import BlogsPage from "@/pages/client/blogs/BlogsPage";
import ServicesPage from "@/pages/client/services/ServicesPage";

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
		path: "/services",
		element: (
			<Layout>
				<ServicesPage />
			</Layout>
		),
	},
	{
		path: "/about-us",
		element: (
			<Layout>
				<AboutUsPage />
			</Layout>
		),
	},
	{
		path: "/contact-us",
		element: (
			<Layout>
				<ContactUsPage />
			</Layout>
		),
	},
];
