import Home from "../features/home/Home";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import AboutUsPage from "@/features/about-us/AboutUsPage";
import ContactUsPage from "@/features/contact-us/ContactUsPage";
import ProjectsPage from "@/features/projects/ProjectsPage";
import Layout from "@/layouts/Layout";

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
		path: "/projects",
		element: (
			<Layout>
				<ProjectsPage />
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
