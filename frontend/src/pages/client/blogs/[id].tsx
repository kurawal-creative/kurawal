import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from "@/utils/api";
import { renderContent } from "@/components/dashboard/posts/detail/DetailContent";

interface Tag {
	id: string;
	name: string;
	slug: string;
}

interface Post {
	id: string;
	slug: string | null;
	title: string;
	description: string | null;
	content: string;
	thumbnail: string | null;
	status: string;
	tagIds: string[];
	createdAt: string;
	updatedAt: string;
}

export default function BlogDetailPage() {
	const { slug } = useParams<{ slug: string }>();
	const id = slug;
	const [post, setPost] = useState<Post | null>(null);
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		if (!id) return;
		const fetchData = async () => {
			try {
				const [postRes, tagsRes] = await Promise.all([api.get(`/posts/${id}`), api.get("/tags", { params: { limit: 100 } })]);
				const postData = postRes.data.data ?? postRes.data;
				const tagsData = tagsRes.data.data ?? tagsRes.data;
				if (!postData || postData.status !== "PUBLISHED") {
					setNotFound(true);
				} else {
					setPost(postData);
					setTags(Array.isArray(tagsData) ? tagsData : []);
				}
			} catch {
				setNotFound(true);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [id]);

	if (loading) {
		return (
			<section className="relative mx-auto max-w-350 border-dashed py-20 min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="px-6">
					<div className="mx-auto max-w-3xl space-y-4">
						<div className="h-6 w-32 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
						<div className="h-10 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
						<div className="h-5 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
						<div className="h-72 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
					</div>
				</div>
			</section>
		);
	}

	if (notFound || !post) {
		return (
			<section className="relative mx-auto max-w-350 border-dashed py-20 min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="px-6 text-center">
					<p className="text-muted-foreground">Article not found.</p>
					<Link to="/blogs" className="mt-4 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
						<ArrowLeft size={14} />
						Back to Blogs
					</Link>
				</div>
			</section>
		);
	}

	const postDate = new Date(post.createdAt).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const postTags = post.tagIds.map((tid) => tags.find((t) => t.id === tid)).filter(Boolean) as Tag[];

	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-350 border-dashed py-12 min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="px-6">
					<div className="mx-auto max-w-3xl">
						<Link to="/blogs" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
							<ArrowLeft size={14} />
							Back to Blogs
						</Link>

						<div className="mt-6 space-y-3">
							{postTags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{postTags.map((tag) => (
										<Badge key={tag.id} variant="default">
											{tag.name}
										</Badge>
									))}
								</div>
							)}
							<h1 className="text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl md:text-4xl dark:text-neutral-100">{post.title}</h1>
							{post.description && <p className="text-base text-neutral-600 dark:text-neutral-400">{post.description}</p>}
							<p className="text-xs text-neutral-500 dark:text-neutral-500">{postDate}</p>
						</div>

						{post.thumbnail && (
							<div className="mt-8 overflow-hidden">
								<img src={post.thumbnail} alt={post.title} className="h-72 w-full object-cover sm:h-96" />
							</div>
						)}

						<div className="mt-10">
							{renderContent(post.content)}
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
