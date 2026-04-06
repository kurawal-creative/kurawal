import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authClient } from "@/lib/auth-client"; // Sesuaikan path ini

interface ProtectedRouteProps {
	children?: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	// Menggunakan hook bawaan Better Auth secara langsung
	const { data: session, isPending } = authClient.useSession();
	const location = useLocation();

	// 1. Handle Loading State
	// Kamu bisa return null atau loading spinner agar tidak "flicker"
	if (isPending) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p>Loading...</p>
			</div>
		);
	}

	// 2. Handle Unauthenticated State
	// Jika session tidak ada (null), arahkan ke login
	if (!session) {
		return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
	}

	// 3. Render Children jika terautentikasi
	return <>{children}</>;
}
