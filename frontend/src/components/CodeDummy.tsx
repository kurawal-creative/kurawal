import { Code, CodeBlock, CodeHeader } from "@/components/animate-ui/components/animate/code";
import { FileText } from "lucide-react";

interface CodeDummyProps {
	duration: number;
	delay: number;
	writing: boolean;
	cursor: boolean;
}

export const CodeDummy = ({ duration, delay, writing, cursor }: CodeDummyProps) => {
	return (
		<Code
			key={`${duration}-${delay}-${writing}-${cursor}`}
			className="h-[340px] w-full overflow-x-auto p-2 whitespace-nowrap"
			code={`'use client';
 
import * as React from "react";

export interface MyComponentProps extends 
React.HTMLAttributes<HTMLDivElement> {
  myProps: string;
}

export function MyComponent
({ myProps, children, ...rest }: 
 MyComponentProps) {
  return (
    <div {...rest}>
      <p>{myProps}</p>
      {children}
    </div>
  );
}`}
		>
			<CodeHeader icon={FileText} copyButton>
				my-component.tsx
			</CodeHeader>

			<CodeBlock cursor={cursor} lang="tsx" writing={writing} duration={duration} delay={delay} />
		</Code>
	);
};
