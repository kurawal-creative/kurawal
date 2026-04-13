import Home from "../features/home/Home";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import AboutUsPage from "@/features/about-us/AboutUsPage";
import ContactUsPage from "@/features/contact-us/ContactUsPage";
import WorksPage from "@/features/works/WorksPage";
import Layout from "@/layouts/layout";
import BlogsPage from "@/features/blogs/BlogsPage";
import ServicesPage from "@/features/services/ServicesPage";

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
		path: "/register",
		element: <Register />,
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
