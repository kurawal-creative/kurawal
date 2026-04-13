import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

import googleIcons from "@/assets/svg/google.svg";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const { data: session } = authClient.useSession();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirect") || "/admin";

	useEffect(() => {
		if (session) {
			navigate(redirectTo);
		}
	}, [session, navigate, redirectTo]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoggingIn(true);

		try {
			const { error: authError } = await authClient.signIn.email({
				email,
				password,
				callbackURL: redirectTo,
			});

			if (authError) {
				setError(authError.message || "Login failed");
				setIsLoggingIn(false);
				return;
			}
		} catch {
			setError("An unexpected error occurred");
			setIsLoggingIn(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center px-4 dark:bg-neutral-950">
			<div className="w-full max-w-sm">
				<h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Log in to your account</h1>
				<p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Welcome back! Please enter your details.</p>

				<form onSubmit={handleSubmit} className="mt-8 space-y-4">
					<div className="space-y-1">
						<Label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
							Email
						</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder="Enter your email"
							disabled={isLoggingIn}
							className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 transition outline-none focus:border-neutral-500 disabled:cursor-not-allowed disabled:opacity-70 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
						/>
					</div>

					<div className="space-y-1">
						<Label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
							Password
						</Label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								placeholder="Password"
								disabled={isLoggingIn}
								className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 pr-11 text-sm text-neutral-900 transition outline-none focus:border-neutral-500 disabled:cursor-not-allowed disabled:opacity-70 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								onClick={() => setShowPassword((prev) => !prev)}
								aria-label={showPassword ? "Hide password" : "Show password"}
								title={showPassword ? "Hide password" : "Show password"}
								className="absolute top-1/2 right-2 h-7 w-7 -translate-y-1/2 rounded-sm text-neutral-500 hover:bg-transparent hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
							>
								{showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
							</Button>
						</div>
					</div>

					<div className="flex items-center justify-between pt-1 text-sm">
						<Label htmlFor="remember-me" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
							<Checkbox id="remember-me" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(Boolean(checked))} disabled={isLoggingIn} className="border-neutral-300 dark:border-neutral-700" />
							Remember me
						</Label>
						<Link to="/forgot-password" className="text-neutral-700 underline underline-offset-3 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100">
							Forgot password
						</Link>
					</div>

					{error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

					<Button type="submit" disabled={isLoggingIn} className="flex h-11 w-full items-center justify-center rounded-md bg-neutral-900 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300">
						{isLoggingIn ? (
							<span className="flex items-center gap-2">
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
								Signing in...
							</span>
						) : (
							"Sign in"
						)}
					</Button>

					<Button type="button" className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800">
						<img src={googleIcons} alt="google" />
						Sign in with Google
					</Button>
				</form>

				<p className="mt-7 text-center text-sm text-neutral-600 dark:text-neutral-400">
					Don't have an account?{" "}
					<Link to="/register" className="font-medium text-neutral-800 underline underline-offset-3 transition hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
