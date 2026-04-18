import { JSX } from "react";
import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";

type Props = {
	placeholder: string;
	className?: string;
	placeholderClassName?: string;
};

export function ContentEditable({ placeholder, className, placeholderClassName }: Props): JSX.Element {
	return <LexicalContentEditable className={className ?? `ContentEditable__root relative box-border block min-h-72 w-full min-w-0 overflow-auto px-8 py-4 focus:outline-none`} aria-placeholder={placeholder} placeholder={<div className={placeholderClassName ?? `text-muted-foreground pointer-events-none absolute top-0 left-0 w-full overflow-hidden px-8 py-4 text-ellipsis select-none`}>{placeholder}</div>} />;
}
