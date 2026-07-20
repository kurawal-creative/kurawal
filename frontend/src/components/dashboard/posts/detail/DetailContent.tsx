import React, { useState } from "react";
import type { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { Badge } from "@/components/ui/badge";
import { Calendar, Copy, Check } from "lucide-react";

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

const extractCodeText = (children?: SerializedLexicalNode[]): string => {
	if (!children) return "";
	return children
		.map((child) => {
			if (child.type === "linebreak") return "\n";
			if ("text" in child && typeof (child as any).text === "string") {
				return (child as any).text;
			}
			if ("children" in child && Array.isArray((child as any).children)) {
				return extractCodeText((child as any).children);
			}
			return "";
		})
		.join("");
};

function CodeBlock({ language, rawText, children }: { language?: string; rawText: string; children: React.ReactNode }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(rawText);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
	};

	return (
		<div className="my-6 overflow-hidden rounded-lg border border-zinc-700/60 bg-zinc-800 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-800">
			<div className="flex items-center justify-between border-b border-zinc-700/60 bg-zinc-900/40 px-4 py-1.5 font-mono text-xs font-medium text-zinc-300">
				<span>{language || "code"}</span>
				<button
					onClick={handleCopy}
					type="button"
					className="inline-flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 font-sans text-xs font-medium text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200 transition-colors"
					title="Copy code"
				>
					{copied ? (
						<>
							<Check className="h-3.5 w-3.5 text-emerald-400" />
							<span className="text-emerald-400">Copied!</span>
						</>
					) : (
						<>
							<Copy className="h-3.5 w-3.5" />
							<span>Copy</span>
						</>
					)}
				</button>
			</div>
			<pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-zinc-100">
				<code>{children}</code>
			</pre>
		</div>
	);
}

export const renderContent = (contentString: string) => {
	try {
		const content = JSON.parse(contentString) as SerializedEditorState;
		const rootNode = content.root;

		const renderNode = (node: SerializedLexicalNode, index: number): React.ReactNode => {
		if (node.type === "paragraph") {
			const paragraphNode = node as { children?: SerializedLexicalNode[] };
			const children = paragraphNode.children ?? [];
			const hasImage = children.some((c) => (c as any).type === "image");
			if (hasImage) {
				return <div key={index} className="mb-4 text-base leading-relaxed">{children.map((child, i) => renderNode(child, i))}</div>;
			}
			return (
				<p key={index} className="mb-4 text-base leading-relaxed">
					{children.map((child, i) => renderNode(child, i))}
				</p>
			);
		}

			if (node.type === "text" || node.type === "code-highlight") {
				const textNode = node as { text?: string; format?: number; highlightType?: string };
				let text: React.ReactNode = textNode.text || "";

				const format = textNode.format || 0;
				const isBold = (format & 1) !== 0;
				const isItalic = (format & 2) !== 0;
				const isStrikethrough = (format & 4) !== 0;
				const isUnderline = (format & 8) !== 0;

				if (isBold) text = <strong key={index}>{text}</strong>;
				if (isItalic) text = <em key={index}>{text}</em>;
				if (isStrikethrough) text = <s key={index}>{text}</s>;
				if (isUnderline) text = <u key={index}>{text}</u>;

				if (textNode.highlightType) {
					const highlightClass =
						{
							keyword: "text-purple-400 font-semibold",
							operator: "text-sky-400",
							punctuation: "text-neutral-400",
							function: "text-amber-300",
							string: "text-emerald-400",
							number: "text-orange-400",
							comment: "text-neutral-500 italic",
							variable: "text-indigo-300",
							attr: "text-teal-300",
							property: "text-rose-400",
						}[textNode.highlightType] || "text-neutral-200";

					return (
						<span key={index} className={highlightClass}>
							{text}
						</span>
					);
				}

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
				const listNode = node as { children?: SerializedLexicalNode[]; listType?: string; tag?: string; start?: number };
				const isNumber = listNode.listType === "number" || listNode.tag === "ol";
				const ListTag = isNumber ? "ol" : "ul";
				const className = isNumber
					? "list-decimal list-outside pl-6 mb-4 space-y-1"
					: "list-disc list-outside pl-6 mb-4 space-y-1";

				return (
					<ListTag key={index} className={className} start={listNode.start}>
						{listNode.children?.map((child, i) => renderNode(child, i))}
					</ListTag>
				);
			}

			if (node.type === "listitem") {
				const listItemNode = node as { children?: SerializedLexicalNode[]; value?: number; checked?: boolean };
				const children = listItemNode.children ?? [];
				const isSublistContainer = children.length > 0 && children.every((c) => c.type === "list" || c.type === "linebreak");

				return (
					<li
						key={index}
						value={listItemNode.value}
						className={isSublistContainer ? "list-none -ml-2 my-1" : "leading-relaxed mb-1"}
					>
						{listItemNode.checked !== undefined && (
							<input type="checkbox" checked={listItemNode.checked} readOnly className="mr-2 rounded" />
						)}
						{children.map((child, i) => renderNode(child, i))}
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
			const codeNode = node as { children?: SerializedLexicalNode[]; language?: string };
			const rawText = extractCodeText(codeNode.children);
			return (
				<CodeBlock key={index} language={codeNode.language} rawText={rawText}>
					{codeNode.children?.map((child, i) => renderNode(child, i))}
				</CodeBlock>
			);
		}

		if (node.type === "linebreak") {
			return <br key={index} />;
		}

		if (node.type === "link" || node.type === "autolink") {
			const linkNode = node as {
				children?: SerializedLexicalNode[];
				url?: string;
				target?: string;
				rel?: string;
				title?: string;
			};
			return (
				<a
					key={index}
					href={linkNode.url || "#"}
					target={linkNode.target || undefined}
					rel={linkNode.rel || (linkNode.target === "_blank" ? "noopener noreferrer" : undefined)}
					title={linkNode.title || undefined}
					className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
				>
					{linkNode.children?.map((child, i) => renderNode(child, i))}
				</a>
			);
		}

		if (node.type === "image") {
			const imageNode = node as { src?: string; altText?: string };
			return (
				<img key={index} src={imageNode.src} alt={imageNode.altText || ""} className="mb-4 max-w-full" loading="lazy" />
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

export function DetailContent({ post }: DetailContentProps) {
	const getStatusVariant = (status: string) => {
		switch (status) {
			case "PUBLISHED":
				return { className: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-500" };
			case "DRAFT":
				return { className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:bg-amber-500/10 dark:text-amber-500" };
			default:
				return { className: "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400" };
		}
	};

	return (
		<div className="mx-auto space-y-8 py-6">
			{post.thumbnail && (
				<div className="relative overflow-hidden rounded-xl">
					<img src={post.thumbnail} alt={post.title} className="max-h-80 w-full object-cover" />
					<div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/20 to-transparent" />
					<div className="absolute top-0 right-0 left-0 flex items-end justify-between p-4 md:p-6">
						<Badge variant="default">
							<Calendar className="mr-2 h-4 w-4" />
							{new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
						</Badge>
						<Badge className={` ${getStatusVariant(post.status).className}`}>{post.status}</Badge>
					</div>
				</div>
			)}
			<div className="space-y-3">
				<h1 className="text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
			</div>
			{renderContent(post.content)}
		</div>
	);
}
