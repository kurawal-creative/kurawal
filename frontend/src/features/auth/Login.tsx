import { useState, useEffect } from "react";
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
	const [isLoggingIn, setIsLoggingIn] = useState(false); // State indikator loading

	const { data: session, isPending } = authClient.useSession();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirect") || "/admin";

	useEffect(() => {
		if (session) {
			navigate(redirectTo);
		}
	}, [session, navigate, redirectTo]);

    if (isPending || session) {
        return null; 
    }

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoggingIn(true); // Mulai loading

		try {
			const { error: authError } = await authClient.signIn.email({
				email,
				password,
				callbackURL: redirectTo,
			});

			if (authError) {
				setError(authError.message || "Login failed");
				setIsLoggingIn(false); // Hentikan loading jika error
				return;
			}

			// Jika sukses, useEffect di atas akan menangani redirect
		} catch (err: any) {
			setError("An unexpected error occurred");
			setIsLoggingIn(false); // Hentikan loading jika crash
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
							<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" disabled={isLoggingIn} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" disabled={isLoggingIn} />
						</div>
						{error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

						<Button type="submit" className="w-full" disabled={isLoggingIn}>
							{isLoggingIn ? (
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
									Logging in...
								</div>
							) : (
								"Login"
							)}
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
