import { useState, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/utils/cloudinary";
import AdminLayout from "@/layouts/adminLayout";

export default function UserProfile() {
	const { data: session, isPending, refetch } = authClient.useSession();
	const user = session?.user;
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [name, setName] = useState(user?.name || "");
	const [image, setImage] = useState(user?.image || "");
	const [email, setEmail] = useState(user?.email || "");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
	const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	if (isPending) return <div className="p-4 text-xs font-bold uppercase">Loading...</div>;
	if (!user) return <div className="p-4 text-xs font-bold text-red-500 uppercase">Not logged in</div>;

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		try {
			const res = await uploadToCloudinary(file);
			await authClient.updateUser({
				image: res.secure_url,
			});
			file.arrayBuffer().then((buf) => setImage(`data:${file.type};base64,${btoa(new Uint8Array(buf).reduce((d, b) => d + String.fromCharCode(b), ""))}`));
			toast.success("IMAGE UPLOADED TO TMP");
		} catch (error: any) {
			toast.error("UPLOAD FAILED");
		} finally {
			setIsUploading(false);
		}
	};

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
			<div className="max-w-xl p-4">
				<div className="mb-6">
					<h1 className="text-xl font-bold uppercase">Profile Settings</h1>
					<p className="text-xs text-gray-500 uppercase">Manage account info and security.</p>
				</div>

				{/* Account Info */}
				<div className="mb-8 border border-black p-4">
					<h2 className="mb-4 border-b border-black pb-2 text-sm font-bold uppercase">Account Info</h2>
					<form onSubmit={handleUpdateProfile} className="space-y-4">
						<div className="flex flex-col gap-1">
							<label className="text-[10px] font-bold text-gray-400 uppercase">Email Address (Locked)</label>
							<input value={user.email} disabled className="border border-black bg-gray-50 px-2 py-1.5 text-xs text-gray-400 grayscale outline-none" />
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-[10px] font-bold uppercase">Profile Picture</label>
							<div className="flex items-center gap-4">
								<div className="h-20 w-20 flex-none overflow-hidden border-2 border-black bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
									<img src={image || `https://ui-avatars.com/api/?name=${name || "?"}&background=random`} alt="Avatar" className="h-full w-full object-cover" />
								</div>
								<div className="flex flex-col gap-2">
									<input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} />
									<button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="border border-black px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-gray-100 disabled:opacity-50">
										{isUploading ? "Uploading..." : "Click to Upload"}
									</button>
									<p className="text-[9px] text-gray-400">SELECT IMAGE TO UPLOAD</p>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-[10px] font-bold uppercase">Display Name</label>
							<input value={name} onChange={(e) => setName(e.target.value)} className="border border-black px-2 py-1.5 text-xs outline-none focus:bg-gray-50" required />
						</div>
						<button type="submit" disabled={isUpdatingProfile} className="border border-black bg-black px-4 py-1.5 text-[10px] font-bold text-white uppercase transition-all hover:bg-white hover:text-black disabled:opacity-50">
							{isUpdatingProfile ? "Saving..." : "Save Changes"}
						</button>
					</form>
				</div>

				{/* Security */}
				<div className="border border-black p-4">
					<h2 className="mb-4 border-b border-black pb-2 text-sm font-bold uppercase">Security</h2>
					<form onSubmit={handleChangePassword} className="space-y-4">
						<div className="flex flex-col gap-1">
							<label className="text-[10px] font-bold uppercase">Current Password</label>
							<input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="border border-black px-2 py-1.5 text-xs outline-none focus:bg-gray-50" required />
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-[10px] font-bold uppercase">New Password</label>
							<input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border border-black px-2 py-1.5 text-xs outline-none focus:bg-gray-50" required />
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-[10px] font-bold uppercase">Confirm New Password</label>
							<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border border-black px-2 py-1.5 text-xs outline-none focus:bg-gray-50" required />
						</div>
						<button type="submit" disabled={isUpdatingPassword} className="border border-black bg-black px-4 py-1.5 text-[10px] font-bold text-white uppercase transition-all hover:bg-white hover:text-black disabled:opacity-50">
							{isUpdatingPassword ? "Updating..." : "Update Password"}
						</button>
					</form>
				</div>
			</div>
		</AdminLayout>
	);
}
