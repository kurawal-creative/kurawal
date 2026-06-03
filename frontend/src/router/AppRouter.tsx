import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

import publicRoutes from "./PublicRoutes";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../pages/NotFound";
import { TopbarProgress } from "@/components/TopbarProgress";
import privateRoutes from "./PrivateRoutes";

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

			{/* Private */}
			{privateRoutes.map(({ path, element }) => (
				<Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
			))}

			{/* Utility */}
			<Route path="/test-progress" element={<TopbarProgress />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
