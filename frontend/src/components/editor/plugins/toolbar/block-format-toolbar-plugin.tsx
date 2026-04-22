import { $isListNode, ListNode } from "@lexical/list";
import { $isHeadingNode } from "@lexical/rich-text";
import { $findMatchingParent, $getNearestNodeOfType } from "@lexical/utils";
import { $isRangeSelection, $isRootOrShadowRoot, type BaseSelection } from "lexical";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar";
import { blockTypeToBlockName } from "@/components/editor/plugins/toolbar/block-format/block-format-data";
import { Select, SelectContent, SelectGroup, SelectTrigger } from "@/components/ui/select";

export function BlockFormatDropDown({ children }: { children: React.ReactNode }) {
	const { activeEditor, blockType, setBlockType } = useToolbarContext();
	const resolvedBlockType = blockType in blockTypeToBlockName ? blockType : "paragraph";
	const activeBlockMeta = blockTypeToBlockName[resolvedBlockType] ?? blockTypeToBlockName.paragraph;

	function $updateToolbar(selection: BaseSelection) {
		if ($isRangeSelection(selection)) {
			const anchorNode = selection.anchor.getNode();
			let element =
				anchorNode.getKey() === "root"
					? anchorNode
					: $findMatchingParent(anchorNode, (e) => {
							const parent = e.getParent();
							return parent !== null && $isRootOrShadowRoot(parent);
						});

			if (element === null) {
				element = anchorNode.getTopLevelElementOrThrow();
			}

			const elementKey = element.getKey();
			const elementDOM = activeEditor.getElementByKey(elementKey);

			if (elementDOM !== null) {
				// setSelectedElementKey(elementKey);
				if ($isListNode(element)) {
					const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
					const type = parentList ? parentList.getListType() : element.getListType();
					setBlockType(type);
				} else {
					const type = $isHeadingNode(element) ? element.getTag() : element.getType();
					if (type in blockTypeToBlockName) {
						setBlockType(type as keyof typeof blockTypeToBlockName);
					}
				}
			}
		}
	}

	useUpdateToolbarHandler($updateToolbar);

	return (
		<Select
			value={resolvedBlockType}
			onValueChange={(value) => {
				setBlockType(value in blockTypeToBlockName ? (value as keyof typeof blockTypeToBlockName) : "paragraph");
			}}
		>
			<SelectTrigger className="h-8! w-min gap-1">
				{activeBlockMeta.icon}
				<span>{activeBlockMeta.label}</span>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>{children}</SelectGroup>
			</SelectContent>
		</Select>
	);
}
