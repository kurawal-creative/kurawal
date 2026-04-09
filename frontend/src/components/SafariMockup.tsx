import { Safari } from "@/components/ui/safari";

import daunesiaVideo from "@/assets/video/daunesia-showcase.mp4";
import { Cursor, CursorFollow, CursorProvider } from "./ui/shadcn-io/animated-cursor";

const SafariMockups = () => (
	<div className="relative w-full">
		<Safari url="https://kurawal.site" videoSrc={daunesiaVideo} mode="default" className="size-full h-auto w-full" />

		<CursorProvider>
			<Cursor>
				<svg className="size-6 text-[#6FB4BA]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
					<path fill="currentColor" d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z" />
				</svg>
			</Cursor>
			<CursorFollow>
				<div className="rounded-lg bg-[#6FB4BA] px-2 py-1 text-sm text-white shadow-lg">User</div>
			</CursorFollow>
		</CursorProvider>
	</div>
);
export default SafariMockups;
