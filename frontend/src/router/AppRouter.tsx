import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

import publicRoutes from "./PublicRoutes";
import privateRoutes from "./PrivateRoutes";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../features/not-found/NotFound";
import TestProgress from "../features/TestProgress";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPostsPage from "@/pages/admin/Posts";
import AdminTagsPage from "@/pages/admin/Tags";
import AdminMediaPage from "@/pages/admin/Media";
import AdminProjectPage from "@/pages/admin/Project";
import AdminProjectDetailPage from "@/pages/admin/ProjectDetail.tsx";
import AdminProjectCreatePage from "@/pages/admin/ProjectCreate.tsx";
import AdminProjectEditPage from "@/pages/admin/ProjectEdit.tsx";
import CreatePostPage from "@/pages/admin/CreatePost";
import EditPostPage from "@/pages/admin/EditPost";
import { NuqsAdapter } from "nuqs/adapters/react";

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

			{/* Admin */}
			<Route
				path="/admin"
				element={
					<ProtectedRoute>
						<AdminDashboard />
					</ProtectedRoute>
				}
			/>

			<Route
				path="/admin/posts"
				element={
					<ProtectedRoute>
						<AdminPostsPage />
					</ProtectedRoute>
				}
			/>

			<Route
				path="/admin/posts/create"
				element={
					<ProtectedRoute>
						<CreatePostPage />
					</ProtectedRoute>
				}
			/>

			<Route
				path="/admin/posts/:id/edit"
				element={
					<ProtectedRoute>
						<EditPostPage />
					</ProtectedRoute>
				}
			/>

			<Route
				path="/admin/tags"
				element={
					<ProtectedRoute>
						<AdminTagsPage />
					</ProtectedRoute>
				}
			/>

			<Route
				path="/admin/media"
				element={
					<ProtectedRoute>
						<NuqsAdapter>
							<AdminMediaPage />
						</NuqsAdapter>
					</ProtectedRoute>
				}
			/>

			<Route
				path="/admin/project"
				element={
					<ProtectedRoute>
						<AdminProjectPage />
					</ProtectedRoute>
				}
			/>

			<Route
				path="/admin/project/create"
				element={
					<ProtectedRoute>
						<AdminProjectCreatePage />
					</ProtectedRoute>
				}
			/>

			<Route
				path="/admin/project/:id"
				element={
					<ProtectedRoute>
						<AdminProjectDetailPage />
					</ProtectedRoute>
				}
			/>

			<Route
				path="/admin/project/:id/edit"
				element={
					<ProtectedRoute>
						<AdminProjectEditPage />
					</ProtectedRoute>
				}
			/>

			{/* Private */}
			{privateRoutes.map(({ path, element }) => (
				<Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
			))}

			{/* Utility */}
			<Route path="/test-progress" element={<TestProgress />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
