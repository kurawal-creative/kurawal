import React from "react";
import type { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface DetailContentProps {
	post: {
		title: string;
		content: string;
		thumbnail?: string;
		status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
		createdAt: string;
		updatedAt: string;
	};
}

export function DetailContent({ post }: DetailContentProps) {
	const getStatusVariant = (status: string) => {
		switch (status) {
			case "PUBLISHED":
				return {
					className: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-500",
				};
			case "DRAFT":
				return {
					className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:bg-amber-500/10 dark:text-amber-500",
				};
			case "ARCHIVED":
				return {
					className: "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400",
				};
			default:
				return {
					className: "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400",
				};
		}
	};

	const renderContent = (contentString: string) => {
		try {
			const content = JSON.parse(contentString) as SerializedEditorState;
			const rootNode = content.root;

			const renderNode = (node: SerializedLexicalNode, index: number): React.ReactNode => {
				if (node.type === "paragraph") {
					const paragraphNode = node as { children?: SerializedLexicalNode[] };
					return (
						<p key={index} className="mb-4 text-base leading-relaxed">
							{paragraphNode.children?.map((child, i) => renderNode(child, i))}
						</p>
					);
				}

				if (node.type === "text") {
					const textNode = node as { text?: string; format?: number };
					let text = textNode.text || "";

					// Format flags: 1=bold, 2=italic, 4=strikethrough, 8=underline
					const format = textNode.format || 0;
					const isBold = (format & 1) !== 0;
					const isItalic = (format & 2) !== 0;
					const isStrikethrough = (format & 4) !== 0;
					const isUnderline = (format & 8) !== 0;

					if (isBold) text = (<strong key={index}>{text}</strong>) as unknown as string;
					if (isItalic) text = (<em key={index}>{text}</em>) as unknown as string;
					if (isStrikethrough) text = (<s key={index}>{text}</s>) as unknown as string;
					if (isUnderline) text = (<u key={index}>{text}</u>) as unknown as string;

					return text;
				}

				if (node.type === "heading") {
					const headingNode = node as { children?: SerializedLexicalNode[]; tag?: string };
					const tag = headingNode.tag || "h2";
					const children = headingNode.children?.map((child, i) => renderNode(child, i));

					const className =
						{
							h1: "text-4xl font-bold mb-6 mt-8",
							h2: "text-3xl font-bold mb-5 mt-7",
							h3: "text-2xl font-bold mb-4 mt-6",
							h4: "text-xl font-bold mb-3 mt-5",
							h5: "text-lg font-bold mb-3 mt-4",
							h6: "text-base font-bold mb-2 mt-4",
						}[tag] || "text-2xl font-bold mb-4 mt-6";

					return React.createElement(tag, { key: index, className }, children);
				}

				if (node.type === "list") {
					const listNode = node as { children?: SerializedLexicalNode[]; listType?: string; tag?: string };
					const ListTag = listNode.listType === "number" || listNode.tag === "ol" ? "ol" : "ul";
					const className = ListTag === "ol" ? "list-decimal list-inside mb-4 space-y-2" : "list-disc list-inside mb-4 space-y-2";

					return (
						<ListTag key={index} className={className}>
							{listNode.children?.map((child, i) => renderNode(child, i))}
						</ListTag>
					);
				}

				if (node.type === "listitem") {
					const listItemNode = node as { children?: SerializedLexicalNode[] };
					return (
						<li key={index} className="ml-4">
							{listItemNode.children?.map((child, i) => renderNode(child, i))}
						</li>
					);
				}

				if (node.type === "quote") {
					const quoteNode = node as { children?: SerializedLexicalNode[] };
					return (
						<blockquote key={index} className="text-muted-foreground mb-4 border-l-4 border-zinc-300 py-2 pl-4 italic dark:border-zinc-700">
							{quoteNode.children?.map((child, i) => renderNode(child, i))}
						</blockquote>
					);
				}

				if (node.type === "code") {
					const codeNode = node as { children?: SerializedLexicalNode[] };
					return (
						<pre key={index} className="bg-muted mb-4 overflow-x-auto rounded-lg p-4">
							<code className="font-mono text-sm">{codeNode.children?.map((child, i) => renderNode(child, i))}</code>
						</pre>
					);
				}

				return null;
			};

			const childrenNode = rootNode as { children?: SerializedLexicalNode[] };
			return <div className="prose prose-lg dark:prose-invert max-w-none">{childrenNode.children?.map((node, index) => renderNode(node, index))}</div>;
		} catch (error) {
			console.error("Error parsing content:", error);
			return <p className="text-muted-foreground">Unable to render content</p>;
		}
	};

	return (
		<div className="mx-auto space-y-8 py-6">
			{/* Cover Image with Overlay */}
			{post.thumbnail && (
				<div className="relative overflow-hidden rounded-xl">
					<img src={post.thumbnail} alt={post.title} className="max-h-80 w-full object-cover" />

					{/* Overlay */}
					<div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/20 to-transparent" />

					{/* Metadata */}
					<div className="absolute top-0 right-0 left-0 flex items-end justify-between p-4 md:p-6">
						<Badge variant="default">
							<Calendar className="mr-2 h-4 w-4" />
							{new Date(post.createdAt).toLocaleDateString("en-US", {
								month: "long",
								day: "numeric",
								year: "numeric",
							})}
						</Badge>

						<Badge className={` ${getStatusVariant(post.status).className}`}>{post.status}</Badge>
					</div>
				</div>
			)}

			{/* Title */}
			<div className="space-y-3">
				<h1 className="text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
			</div>

			{/* Content */}
			{renderContent(post.content)}
		</div>
	);
}
