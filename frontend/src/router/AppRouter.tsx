import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

import publicRoutes from "./PublicRoutes";
import privateRoutes from "./PrivateRoutes";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../features/not-found/NotFound";
import TestProgress from "../features/TestProgress";
import Admin from "@/pages/admin/Admin";
import { NuqsAdapter } from "nuqs/adapters/react";
import UploadMedia from "@/pages/admin/media/UploadMedia";
import AdminLayout from "@/components/layouts/AdminLayout";
import Posts from "@/features/posts/Posts";
import CreatePost from "@/features/posts/CreatePost";
import EditPost from "@/features/posts/EditPost";

export default function AppRouter() {
	const location = useLocation();

	useEffect(() => {
		nprogress.configure({ showSpinner: false });
		nprogress.start();
		const timer = setTimeout(() => nprogress.done(), 300);
		return () => clearTimeout(timer);
	}, [location]);

	return (
		<Routes>
			{/* Public */}
			{publicRoutes.map(({ path, element }) => (
				<Route key={path} path={path} element={element} />
			))}

			{/* Medie */}
			<Route
				path="/media"
				element={
					<ProtectedRoute>
						<NuqsAdapter>
							{/* <Nuqsad */}
							<UploadMedia />
						</NuqsAdapter>
					</ProtectedRoute>
				}
			/>

			{/* Nested admin routes dari pr ivateRoutes */}
			<Route
				path="/admin"
				element={
					<ProtectedRoute>
						<AdminLayout>
							<Outlet />
						</AdminLayout>
					</ProtectedRoute>
				}
			>
				<Route path="posts" element={<Posts />} />
				<Route path="create-post" element={<CreatePost />} />
				<Route path="edit-post/:id" element={<EditPost />} />
			</Route>

			{/* Utility */}
			<Route path="/test-progress" element={<TestProgress />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
