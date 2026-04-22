import { type ReactNode, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

interface ProtectedRouteProps {
	children?: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { data: session, isPending } = authClient.useSession();
	const location = useLocation();

	// Memoize auth state (biar stabil & tidak recompute tiap render)
	const isAuthenticated = useMemo(() => {
		return !!session;
	}, [session]);

	const redirectUrl = useMemo(() => {
		return `/login?redirect=${encodeURIComponent(location.pathname)}`;
	}, [location.pathname]);

	// 1. Loading state (hindari flicker + unnecessary render)
	if (isPending) {
		return null; // lebih clean daripada render div loading
	}

	// 2. Jika tidak login → redirect
	if (!isAuthenticated) {
		return <Navigate to={redirectUrl} replace />;
	}

	// 3. Jika login → render children
	return <>{children}</>;
}
