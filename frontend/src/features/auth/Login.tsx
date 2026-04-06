import { useState, useEffect } from "react";
// Import authClient dari path yang sesuai
import { authClient } from "@/lib/auth-client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	// Mengganti useAuth dengan hook bawaan Better Auth
	const { data: session } = authClient.useSession();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirect") || "/";

	useEffect(() => {
		// Jika session ditemukan, redirect ke halaman tujuan
		if (session) {
			navigate(redirectTo);
		}
	}, [session, navigate, redirectTo]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			// Menggunakan method signIn dari Better Auth
			const { error: authError } = await authClient.signIn.email({
				email,
				password,
				// Better Auth menangani redirect secara internal jika diinginkan,
				// tapi di sini kita tetap pakai navigate manual agar konsisten dengan kodemu
				callbackURL: redirectTo,
			});

			if (authError) {
				setError(authError.message || "Login failed");
				return;
			}

			// Jika sukses, navigasi dilakukan oleh useEffect di atas atau manual di sini
			navigate(redirectTo);
		} catch (err: any) {
			setError("An unexpected error occurred");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Enter your credentials to access your account</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
						</div>
						{error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
						<Button type="submit" className="w-full">
							Login
						</Button>
					</form>
					<div className="mt-4 text-center text-sm">
						Don't have an account?{" "}
						<Link to="/register" className="text-primary hover:underline">
							Register
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
