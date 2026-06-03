// UserProfile.tsx
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import AdminLayout from "@/layouts/adminLayout";
import AccountInfo from "@/components/AccountInfo";
import SecurityInfo from "@/components/SecurityInfo";

export default function UserProfile() {
	const { data: session, isPending } = authClient.useSession();
	const user = session?.user;

	const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
	const [name, setName] = useState(user?.name || "");
	const [image, setImage] = useState(user?.image || "");
	const [email, setEmail] = useState(user?.email || "");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
	const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

	if (isPending) return <div className="p-4 text-xs font-bold uppercase">Loading...</div>;
	if (!user) return <div className="p-4 text-xs font-bold text-red-500 uppercase">Not logged in</div>;

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsUpdatingProfile(true);
		try {
			if (email !== user.email) {
				await authClient.changeEmail({
					newEmail: email,
				});
				toast.success("EMAIL CHANGE REQUESTED / UPDATED");
			}
			if (name !== user.name || image !== user.image) {
				await authClient.updateUser({
					name,
					image: image || undefined,
				});
				toast.success("PROFILE UPDATED");
			}
		} catch (error: any) {
			toast.error(error.message || "FAILED TO UPDATE PROFILE");
		} finally {
			setIsUpdatingProfile(false);
		}
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			toast.error("NEW PASSWORDS DO NOT MATCH");
			return;
		}
		setIsUpdatingPassword(true);
		try {
			const { error } = await authClient.changePassword({
				newPassword,
				currentPassword,
				revokeOtherSessions: true,
			});
			if (error) {
				toast.error(error.message || "FAILED TO CHANGE PASSWORD");
			} else {
				toast.success("PASSWORD UPDATED");
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
			}
		} catch (error: any) {
			toast.error("AN UNEXPECTED ERROR OCCURRED");
		} finally {
			setIsUpdatingPassword(false);
		}
	};

	return (
		<AdminLayout>
			<div className="w-full">
				<div className="mb-6">
					<h1 className="text-2xl font-bold">Profile Settings</h1>
					<p className="text-sm text-gray-500">Manage account info and security.</p>
				</div>

				{/* Tabs */}
				<div className="mb-6 border-b">
					<div className="flex gap-6">
						<button onClick={() => setActiveTab("profile")} className={`relative pb-3 text-sm font-medium transition ${activeTab === "profile" ? "text-foreground" : "text-muted-foreground hover:text-foreground"} `}>
							Profile
							{activeTab === "profile" && <span className="bg-primary absolute -bottom-px left-0 h-0.5 w-full rounded-full" />}
						</button>

						<button onClick={() => setActiveTab("security")} className={`relative pb-3 text-sm font-medium transition ${activeTab === "security" ? "text-foreground" : "text-muted-foreground hover:text-foreground"} `}>
							Security
							{activeTab === "security" && <span className="bg-primary absolute -bottom-px left-0 h-0.5 w-full rounded-full" />}
						</button>
					</div>
				</div>

				{activeTab === "profile" && <AccountInfo user={user} name={name} setName={setName} image={image} setImage={setImage} email={email} setEmail={setEmail} isUpdatingProfile={isUpdatingProfile} setIsUpdatingProfile={setIsUpdatingProfile} onProfileUpdate={handleUpdateProfile} />}

				{activeTab === "security" && <SecurityInfo currentPassword={currentPassword} setCurrentPassword={setCurrentPassword} newPassword={newPassword} setNewPassword={setNewPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} isUpdatingPassword={isUpdatingPassword} onPasswordChange={handleChangePassword} />}
			</div>
		</AdminLayout>
	);
}
