import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Separator } from "./ui/separator";

interface SecurityInfoProps {
	currentPassword: string;
	setCurrentPassword: (password: string) => void;
	newPassword: string;
	setNewPassword: (password: string) => void;
	confirmPassword: string;
	setConfirmPassword: (password: string) => void;
	isUpdatingPassword: boolean;
	onPasswordChange: (e: React.FormEvent) => Promise<void>;
}

export default function SecurityInfo({ currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, isUpdatingPassword, onPasswordChange }: SecurityInfoProps) {
	return (
		<Card className="mx-auto">
			<CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				{/* Title */}
				<div>
					<CardTitle className="text-xl font-semibold">Security</CardTitle>
					<CardDescription>Change your password</CardDescription>
				</div>

				{/* Desktop Button */}
				<Button type="submit" form="security-form" disabled={isUpdatingPassword} className="hidden shrink-0 md:flex">
					{isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Update Password
				</Button>
			</CardHeader>

			<Separator className="-my-2" />

			<CardContent>
				<form id="security-form" onSubmit={onPasswordChange} className="space-y-4">
					{/* Current Password */}
					<div className="space-y-1">
						<Label className="text-muted-foreground text-xs">Current Password</Label>
						<Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="placeholder:text-muted-foreground/70 placeholder:text-xs" placeholder="Enter current password" required />
					</div>

					{/* New Password */}
					<div className="space-y-1">
						<Label className="text-muted-foreground text-xs">New Password</Label>
						<Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="placeholder:text-muted-foreground/70 placeholder:text-xs" placeholder="Enter new password" required />
					</div>

					{/* Confirm Password */}
					<div className="space-y-1">
						<Label className="text-muted-foreground text-xs">Confirm New Password</Label>
						<Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="placeholder:text-muted-foreground/70 placeholder:text-xs" placeholder="Confirm new password" required />
					</div>
				</form>
			</CardContent>

			{/* Mobile Button */}
			<CardFooter className="md:hidden">
				<Button type="submit" form="security-form" disabled={isUpdatingPassword} className="w-full">
					{isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Update Password
				</Button>
			</CardFooter>
		</Card>
	);
}
