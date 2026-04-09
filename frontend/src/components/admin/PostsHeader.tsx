import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PostsHeader() {
	const navigate = useNavigate();

	return (
		<div className="flex items-center justify-between">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Posts Management</h1>
				<p className="text-muted-foreground mt-2">Manage all your posts and projects</p>
			</div>
			<Button onClick={() => navigate("/admin/posts/create")}>
				<Plus className="mr-2 h-4 w-4" />
				New Post
			</Button>
		</div>
	);
}
