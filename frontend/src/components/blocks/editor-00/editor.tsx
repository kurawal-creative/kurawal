"use client";

import { type InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type { EditorState, SerializedEditorState } from "lexical";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
// import { Plugins } from "./plugins";

import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ParagraphNode, TextNode } from "lexical";
import { ListItemNode, ListNode } from "@lexical/list";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph";
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading";
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list";
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list";
import { FormatCheckList } from "@/components/editor/plugins/toolbar/block-format/format-check-list";
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote";
import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { useState } from "react";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin";

const editorConfig: InitialConfigType = {
	namespace: "Editor",
	theme: editorTheme,
	nodes: [HeadingNode, ParagraphNode, TextNode, QuoteNode, ListNode, ListItemNode],
	onError: (error: Error) => {
		console.error(error);
	},
};

export function Editor({ editorState, editorSerializedState, onChange, onSerializedChange }: { editorState?: EditorState; editorSerializedState?: SerializedEditorState; onChange?: (editorState: EditorState) => void; onSerializedChange?: (editorSerializedState: SerializedEditorState) => void }) {
	return (
		<div className="bg-background overflow-hidden rounded-lg border shadow">
			<LexicalComposer
				initialConfig={{
					...editorConfig,
					...(editorState ? { editorState } : {}),
					...(editorSerializedState ? { editorState: JSON.stringify(editorSerializedState) } : {}),
				}}
			>
				<TooltipProvider>
					<Plugins />

					<OnChangePlugin
						ignoreSelectionChange={true}
						onChange={(editorState) => {
							onChange?.(editorState);
							onSerializedChange?.(editorState.toJSON());
						}}
					/>
				</TooltipProvider>
			</LexicalComposer>
		</div>
	);
}

const placeholder = "Start typing...";
export function Plugins() {
	const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
	const onRef = (_floatingAnchorElem: HTMLDivElement) => {
		if (_floatingAnchorElem !== null) {
			setFloatingAnchorElem(_floatingAnchorElem);
		}
	};

	return (
		<div className="relative">
			{/* toolbar plugins */}
			<ToolbarPlugin>
				{({ blockType }) => (
					<div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1">
						<BlockFormatDropDown>
							<FormatParagraph />
							<FormatHeading levels={["h1", "h2", "h3"]} />
							<FormatNumberedList />
							<FormatBulletedList />
							<FormatCheckList />
							<FormatQuote />
						</BlockFormatDropDown>
						<ElementFormatToolbarPlugin />
						<FontFormatToolbarPlugin />
					</div>
				)}
			</ToolbarPlugin>
			<div className="relative">
				<RichTextPlugin
					contentEditable={
						<div className="">
							<div className="" ref={onRef}>
								<ContentEditable placeholder={placeholder} className="ContentEditable__root relative block h-72 min-h-72 min-h-full overflow-auto px-8 py-4 focus:outline-none" />
							</div>
						</div>
					}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<ListPlugin />
				<CheckListPlugin />
				<TabIndentationPlugin />

				{/* rest of the plugins */}
			</div>
		</div>
	);
}
