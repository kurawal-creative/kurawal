import AdminLayout from "@/components/layouts/AdminLayout";
import { useState } from "react";
import UploadMedia from "@/pages/admin/media/UploadMedia";

export default function AdminMediaPage() {
	return (
		<AdminLayout>
			<div className="pb-8">
				<UploadMedia />
			</div>
		</AdminLayout>
	);
}
