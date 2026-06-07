import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from "@/utils/api";
import BlogCardSkeleton from "@/components/skeleton/BlogCardSkeleton";

interface Post {
	id: string;
	title: string;
	description: string | null;
	content: string;
	thumbnail: string | null;
	status: string;
	tagIds: string[];
	createdAt: string;
	updatedAt: string;
}

interface Tag {
	id: string;
	name: string;
	slug: string;
}

export default function BlogsCollection() {
	const [activeFilter, setActiveFilter] = useState("All Articles");
	const [posts, setPosts] = useState<Post[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [showAll, setShowAll] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [postsResponse, tagsResponse] = await Promise.all([api.get("/posts", { params: { limit: 50 } }), api.get("/tags")]);

				const postsData = postsResponse.data.data || postsResponse.data;
				const tagsData = tagsResponse.data.data || tagsResponse.data;

				// Filter only PUBLISHED posts
				const publishedPosts = Array.isArray(postsData) ? postsData.filter((post: Post) => post.status === "PUBLISHED") : [];

				setPosts(publishedPosts);
				setTags(Array.isArray(tagsData) ? tagsData : []);
			} catch (error) {
				console.error("Failed to fetch posts or tags", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const blogFilters = useMemo(() => {
		const tagCounts = tags.map((tag) => {
			const count = posts.filter((post) => post.tagIds.includes(tag.id)).length;
			return { label: tag.name, count, tagId: tag.id };
		});

		return [{ label: "All Articles", count: posts.length, tagId: null }, ...tagCounts];
	}, [posts, tags]);

	const filteredPosts = useMemo(() => {
		let filtered = posts;

		// Filter by tag
		if (activeFilter !== "All Articles") {
			const selectedTag = tags.find((tag) => tag.name === activeFilter);
			if (selectedTag) {
				filtered = filtered.filter((post) => post.tagIds.includes(selectedTag.id));
			}
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter((post) => post.title.toLowerCase().includes(query) || post.description?.toLowerCase().includes(query));
		}

		return filtered;
	}, [posts, tags, activeFilter, searchQuery]);

	const displayedPosts = showAll ? filteredPosts : filteredPosts.slice(0, 3);
	const hasMore = filteredPosts.length > 3;

	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-350 border-dashed py-12 min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="px-6">
					<div className="text-left">
						<h2 className="max-w-4xl text-2xl leading-tight font-bold text-neutral-800 sm:text-3xl md:text-4xl lg:text-4xl dark:text-neutral-100">Explore Our Insights</h2>

						<p className="mt-2 max-w-2xl text-sm text-neutral-700 md:text-base dark:text-neutral-400">Discover our latest articles, ideas, and perspectives on design, technology, and innovation.</p>
					</div>
					<div className="mt-4 flex flex-col gap-3">
						{/* Search */}
						<div className="w-full max-w-90">
							<input type="text" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-800 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-400" />
						</div>

						{/* Filters */}
						<div className="flex flex-wrap gap-2">
							{loading ? (
								[...Array(3)].map((_, index) => (
									<div key={index} className="h-8 w-28 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
								))
							) : (
								blogFilters.map((item) => (
									<Badge
										key={item.label}
										variant="outline"
										onClick={() => setActiveFilter(item.label)}
										className={`group rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
											activeFilter === item.label
												? "cursor-default border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950"
												: "cursor-pointer border border-dashed border-neutral-300 bg-white text-neutral-700 hover:border-solid hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-950"
										}`}
									>
										<span>{item.label}</span>

										<span className={`ml-2 rounded-full border border-dashed px-1.5 py-0.5 text-[11px] leading-none ${activeFilter === item.label ? "text-white/80 dark:text-neutral-800" : "text-neutral-500 group-hover:text-white dark:text-neutral-300 dark:group-hover:text-neutral-950"}`}>{item.count}</span>
									</Badge>
								))
							)}
						</div>
					</div>
					<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{loading ? (
							[...Array(3)].map((_, index) => <BlogCardSkeleton key={index} />)
						) : displayedPosts.length === 0 ? (
							<div className="col-span-full py-12 text-center">
								<p className="text-muted-foreground">No articles found.</p>
							</div>
						) : (
							displayedPosts.map((post) => {
								const firstTag = post.tagIds[0] ? tags.find((tag) => tag.id === post.tagIds[0]) : null;
								const postDate = new Date(post.createdAt).toLocaleDateString("en-US", {
									month: "long",
									day: "numeric",
									year: "numeric",
								});

								return (
									<div key={post.id} className="flex flex-col border border-dashed">
										<div className="relative w-full overflow-hidden">
											{post.thumbnail ? <img src={post.thumbnail} alt={post.title} className="h-56 w-full object-cover" loading="lazy" /> : <div className="h-56 w-full bg-neutral-200 dark:bg-neutral-800" />}
											{firstTag && (
												<Badge variant={"default"} className="absolute top-4 left-4">
													{firstTag.name}
												</Badge>
											)}
										</div>
										<div className="space-y-1.5 p-4">
											<p className="text-muted-foreground text-xs">{postDate}</p>
											<h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{post.title}</h3>
											<p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">{post.description || "No description available."}</p>
										</div>
										<div className="w-full px-4 pb-4">
											<Link
												to={`/blogs/${post.id}`}
												className="group inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-800 transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-950"
											>
												<span>Read More</span>
												<span className="transition-transform group-hover:translate-x-0.5">
													<ArrowRight size={14} />
												</span>
											</Link>
										</div>
									</div>
								);
							})
						)}
					</div>

					{!loading && hasMore && (
						<div className="mt-8 flex justify-center">
							<button
								onClick={() => setShowAll(!showAll)}
								className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-800 transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-950"
							>
								{showAll ? "Show Less" : "Show More"}
							</button>
						</div>
					)}
				</div>
			</section>
		</>
	);
}
