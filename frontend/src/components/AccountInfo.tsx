import { useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil } from "lucide-react";
import { Separator } from "./ui/separator";

export default function AccountInfo({ user, name, setName, image, setImage, isUpdatingProfile, onProfileUpdate }: any) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);

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

			toast.success("Profile image updated");
		} catch {
			toast.error("Upload failed");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<Card className="mx-auto">
			<CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				{/* Title */}
				<div>
					<CardTitle className="text-xl font-semibold">Display Settings</CardTitle>
					<CardDescription>Update your personal information and profile</CardDescription>
				</div>

				{/* Desktop Button */}
				<Button onClick={onProfileUpdate} disabled={isUpdatingProfile} className="hidden shrink-0 md:flex">
					{isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Save Changes
				</Button>
			</CardHeader>

			<Separator className="-my-2" />

			<CardContent className="space-y-8">
				{/* Profile Section */}
				<div className="flex flex-col gap-6 md:flex-row md:items-center">
					{/* Avatar */}
					<div className="group relative w-fit">
						<Avatar className="h-28 w-28 border">
							<AvatarImage src={image || `https://ui-avatars.com/api/?name=${name || "?"}&background=random`} />
							<AvatarFallback>{name?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
						</Avatar>

						{/* Overlay */}
						<div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition group-hover:opacity-100">
							<Pencil className="h-5 w-5 text-white" />
						</div>

						<input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageUpload} />
					</div>

					{/* Info */}
					<div className="flex-1 space-y-3">
						<div className="space-y-1">
							<Label className="text-muted-foreground text-xs">Email</Label>
							<Input value={user.email} disabled className="bg-muted/50 h-9 cursor-not-allowed" />
						</div>

						<div className="space-y-1">
							<Label className="text-muted-foreground text-xs">Display Name</Label>
							<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-9" />
						</div>
					</div>
				</div>
			</CardContent>

			{/* Mobile Button */}
			<CardFooter className="md:hidden">
				<Button onClick={onProfileUpdate} disabled={isUpdatingProfile} className="w-full">
					{isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Save Changes
				</Button>
			</CardFooter>
		</Card>
	);
}
