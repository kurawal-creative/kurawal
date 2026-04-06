import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

interface User {
	id: string;
	name: string;
	email: string;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	// Mengambil session data dari Better Auth client
	const {
		data: session,
		isPending,
		// refetch bisa digunakan jika ingin sinkronisasi manual
	} = authClient.useSession();

	useEffect(() => {
		// Sinkronisasi state internal 'user' dengan data dari Better Auth session
		if (!isPending) {
			if (session?.user) {
				// Mapping property jika field di Better Auth berbeda (misal: id -> id)
				setUser({
					id: session.user.id,
					name: session.user.name,
					email: session.user.email,
				});
			} else {
				setUser(null);
			}
			setLoading(false);
		}
	}, [session, isPending]);

	const login = async (email: string, password: string) => {
		try {
			// Menggunakan Better Auth signIn method
			const { data, error } = await authClient.signIn.email({
				email,
				password,
			});

			if (error) {
				throw new Error(error.message || "Login failed");
			}

			// Opsional: Jika ingin segera set user tanpa menunggu re-render useSession
			if (data?.user) {
				setUser({
					id: data.user.id,
					name: data.user.name,
					email: data.user.email,
				});
			}
		} catch (error: any) {
			throw new Error(error.message || "Login failed");
		}
	};

	const logout = async () => {
		try {
			await authClient.signOut();
			setUser(null);
		} catch (error: any) {
			throw new Error(error.message || "Logout failed");
		}
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, loading: loading || isPending }}>
			<>{children}</>
		</AuthContext.Provider>
	);
};
