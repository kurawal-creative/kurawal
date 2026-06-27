import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { tagsApi } from "@/utils/adminApi";
import AdminLayout from "@/layouts/adminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Calendar, MapPin, Building2, Award as AwardIcon, Tag } from "lucide-react";

interface TagItem {
	id: string;
	name: string;
}

interface Award {
	id: string;
	title: string;
	tagIds: string[];
	date: string;
	description: string;
	institution: string;
	location: string;
	createdAt: string;
	updatedAt: string;
}

export default function DetailAwardPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [award, setAward] = useState<Award | null>(null);
	const [tags, setTags] = useState<TagItem[]>([]);

	useEffect(() => {
		fetchData();
	}, [id]);

	const fetchData = async () => {
		if (!id) return;

		setLoading(true);
		try {
			// Fetch all tags
			const tagsData = await tagsApi.getAll(1, 100);
			setTags(tagsData.data || []);

			// Fetch award data
			// TODO: Replace with actual API call
			// const awardData = await awardsApi.getById(id);
			// setAward(awardData);

			// Temporary: navigate back if no data
			toast.error("Award not found");
			navigate("/dashboard/awards");
		} catch (error) {
			console.error("Error fetching data:", error);
			toast.error("Failed to fetch award");
			navigate("/dashboard/awards");
		} finally {
			setLoading(false);
		}
	};

	const getTagNames = (tagIds: string[]) => {
		return tags.filter((tag) => tagIds.includes(tag.id)).map((tag) => tag.name);
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="space-y-5">
					<div className="flex items-center gap-4">
						<Skeleton className="h-10 w-10" />
						<div className="space-y-2">
							<Skeleton className="h-8 w-64" />
							<Skeleton className="h-4 w-96" />
						</div>
					</div>
					<div className="bg-card max-w-2xl space-y-4 rounded-xl border p-6">
						<Skeleton className="h-20" />
						<Skeleton className="h-20" />
						<Skeleton className="h-20" />
					</div>
				</div>
			</AdminLayout>
		);
	}

	if (!award) {
		return null;
	}

	const tagNames = getTagNames(award.tagIds);

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">Award Details</h1>
						<p className="text-muted-foreground mt-1 text-sm">View detailed information about this award.</p>
					</div>

					<div className="flex gap-2">
						<Button asChild variant="outline" size="sm">
							<Link to="/dashboard/awards">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back
							</Link>
						</Button>

						<Button onClick={() => navigate(`/dashboard/awards/edit/${award.id}`)} size="sm">
							<Edit className="mr-2 h-4 w-4" />
							Edit Award
						</Button>
					</div>
				</div>

				<div className="space-y-6">
					{/* Award Header Section */}
					<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
						<div className="border-b px-6 py-4">
							<h2 className="text-base font-semibold">Award Information</h2>
							<p className="text-muted-foreground mt-1 text-sm">Recognition and achievement details</p>
						</div>

						<div className="space-y-5 p-6">
							<div className="flex items-start justify-between">
								<div className="space-y-3 flex-1">
									<h3 className="text-xl font-semibold">{award.title}</h3>
									<div className="flex flex-wrap gap-2">
										{tagNames.map((tagName, index) => (
											<Badge key={index} variant="secondary" className="gap-1">
												<Tag className="h-3 w-3" />
												{tagName}
											</Badge>
										))}
									</div>
								</div>

								<div className="bg-primary/10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full">
									<AwardIcon className="text-primary h-7 w-7" />
								</div>
							</div>
						</div>
					</div>

					{/* Award Details Section */}
					<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
						<div className="border-b px-6 py-4">
							<h2 className="text-base font-semibold">Details</h2>
							<p className="text-muted-foreground mt-1 text-sm">Date, location, and institution information</p>
						</div>

						<div className="space-y-5 p-6">
							<div className="space-y-2">
								<label className="text-sm font-medium">Award Date</label>
								<div className="flex items-center gap-3 rounded-lg border px-3 py-2">
									<Calendar className="text-muted-foreground h-4 w-4" />
									<p className="text-sm font-medium">
										{new Date(award.date).toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</p>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Institution</label>
								<div className="flex items-center gap-3 rounded-lg border px-3 py-2">
									<Building2 className="text-muted-foreground h-4 w-4" />
									<p className="text-sm font-medium">{award.institution}</p>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Location</label>
								<div className="flex items-center gap-3 rounded-lg border px-3 py-2">
									<MapPin className="text-muted-foreground h-4 w-4" />
									<p className="text-sm font-medium">{award.location}</p>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Description</label>
								<div className="rounded-lg border px-3 py-2">
									<p className="text-sm leading-relaxed">{award.description}</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex gap-2">
						<Button onClick={() => navigate(`/dashboard/awards/edit/${award.id}`)} className="flex-1">
							<Edit className="mr-2 h-4 w-4" />
							Edit Award
						</Button>

						<Button onClick={() => navigate("/dashboard/awards")} variant="outline" className="flex-1">
							Back to Awards
						</Button>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
