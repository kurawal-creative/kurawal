import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { tagsApi } from "@/utils/adminApi";
import AdminLayout from "@/layouts/adminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2, Award, Calendar, MapPin } from "lucide-react";

interface Tag {
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

export default function AdminAwardsPage() {
	const navigate = useNavigate();
	const [awards, setAwards] = useState<Award[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchAwards = useCallback(async () => {
		try {
			setLoading(true);
			// Fetch tags first
			const tagsData = await tagsApi.getAll(1, 100);
			setTags(tagsData.data || []);

			// TODO: Replace with actual API call
			// const data = await awardsApi.getAll();
			// setAwards(data.data || []);

			// Temporary mock data
			setAwards([]);
		} catch (error) {
			console.error("Error fetching awards:", error);
			toast.error("Failed to fetch awards");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAwards();
	}, [fetchAwards]);

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this award?")) return;

		try {
			// TODO: Replace with actual API call
			// await awardsApi.delete(id);
			toast.success("Award deleted successfully");
			fetchAwards();
		} catch (error) {
			console.error("Error deleting award:", error);
			toast.error("Failed to delete award");
		}
	};

	const getTagNames = (tagIds: string[]) => {
		return tags.filter((tag) => tagIds.includes(tag.id)).map((tag) => tag.name);
	};

	const filteredAwards = awards.filter((award) => {
		const searchLower = searchTerm.toLowerCase();
		const tagNames = getTagNames(award.tagIds).join(" ").toLowerCase();
		return (
			award.title.toLowerCase().includes(searchLower) ||
			award.institution.toLowerCase().includes(searchLower) ||
			award.location.toLowerCase().includes(searchLower) ||
			tagNames.includes(searchLower)
		);
	});

	const getAwardStats = () => {
		const totalAwards = awards.length;
		const currentYear = new Date().getFullYear();
		const thisYear = awards.filter((a) => new Date(a.date).getFullYear() === currentYear).length;
		const lastYear = awards.filter((a) => new Date(a.date).getFullYear() === currentYear - 1).length;
		return { totalAwards, thisYear, lastYear };
	};

	const stats = getAwardStats();

	return (
		<AdminLayout>
			<div className="space-y-5">
				{/* Header */}
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">Awards Management</h1>
						<p className="text-muted-foreground mt-1 text-sm">Manage and organize all your achievements and recognitions.</p>
					</div>

					<Button onClick={() => navigate("/dashboard/awards/create")}>
						<Plus className="mr-2 h-4 w-4" />
						New Award
					</Button>
				</div>

				{/* Stats */}
				<div className="grid gap-3 md:grid-cols-3">
					<div className="bg-card flex items-center justify-between rounded-xl border p-4">
						<div>
							<p className="text-muted-foreground text-xs font-medium">Total Awards</p>
							<p className="mt-1 text-2xl font-bold">{stats.totalAwards}</p>
						</div>

						<div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-lg">
							<Award className="text-primary h-5 w-5" />
						</div>
					</div>

					<div className="bg-card flex items-center justify-between rounded-xl border p-4">
						<div>
							<p className="text-muted-foreground text-xs font-medium">This Year</p>
							<p className="mt-1 text-2xl font-bold">{stats.thisYear}</p>
						</div>

						<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
							<Calendar className="h-5 w-5 text-emerald-600" />
						</div>
					</div>

					<div className="bg-card flex items-center justify-between rounded-xl border p-4">
						<div>
							<p className="text-muted-foreground text-xs font-medium">Last Year</p>
							<p className="mt-1 text-2xl font-bold">{stats.lastYear}</p>
						</div>

						<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-500/10">
							<Calendar className="h-5 w-5 text-blue-600" />
						</div>
					</div>
				</div>

				<div className="bg-card rounded-xl border">
					{/* Toolbar */}
					<div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex items-center gap-2">
							<div className="relative w-full lg:w-96">
								<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
								<Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search awards..." className="h-9 pl-9" />
							</div>
						</div>

						<div className="flex gap-2">
							<Button variant="outline" size="icon" className="h-9 w-10">
								<Filter className="h-4 w-4" />
							</Button>

							<Button variant="outline" size="icon" className="h-9 w-10">
								<ArrowUpDown className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Table */}
					{loading ? (
						<div className="space-y-3 p-6">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="flex items-center gap-4">
									<Skeleton className="h-12 w-12 rounded" />
									<Skeleton className="h-4 flex-1" />
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-4 w-24" />
								</div>
							))}
						</div>
					) : filteredAwards.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-10">
							<div className="bg-muted/50 mb-3 flex h-14 w-14 items-center justify-center rounded-full">
								<Award className="text-muted-foreground h-7 w-7" />
							</div>

							<p className="text-sm font-medium">No awards found</p>

							<p className="text-muted-foreground mt-1 text-xs">Try changing the search term or create a new award.</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/30 hover:bg-muted/30">
									<TableHead className="w-14">No.</TableHead>
									<TableHead>Award</TableHead>
									<TableHead>Institution</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Location</TableHead>
									<TableHead className="w-14">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{filteredAwards.map((award, index) => {
									const tagNames = getTagNames(award.tagIds);
									return (
										<TableRow key={award.id} className="group">
											<TableCell className="text-muted-foreground">{index + 1}</TableCell>

											<TableCell>
												<div className="flex flex-col gap-2">
													<p className="font-medium">{award.title}</p>
													<div className="flex flex-wrap gap-1">
														{tagNames.map((tagName, idx) => (
															<Badge key={idx} variant="secondary" className="text-xs">
																{tagName}
															</Badge>
														))}
													</div>
												</div>
											</TableCell>

											<TableCell className="text-muted-foreground">{award.institution}</TableCell>

											<TableCell className="text-muted-foreground">
												{new Date(award.date).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})}
											</TableCell>

											<TableCell>
												<div className="flex items-center gap-1 text-muted-foreground">
													<MapPin className="h-3 w-3" />
													{award.location}
												</div>
											</TableCell>

											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>

													<DropdownMenuContent align="end">
														<DropdownMenuItem onClick={() => navigate(`/dashboard/awards/detail/${award.id}`)}>
															<Eye className="mr-2 h-4 w-4" />
															View Details
														</DropdownMenuItem>

														<DropdownMenuItem onClick={() => navigate(`/dashboard/awards/edit/${award.id}`)}>
															<Pencil className="mr-2 h-4 w-4" />
															Edit
														</DropdownMenuItem>

														<DropdownMenuSeparator />

														<DropdownMenuItem variant="destructive" onClick={() => handleDelete(award.id)}>
															<Trash2 className="mr-2 h-4 w-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</div>
			</div>
		</AdminLayout>
	);
}
