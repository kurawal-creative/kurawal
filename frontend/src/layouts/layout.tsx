import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { type ReactNode } from "react";

interface LayoutProps {
	children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<>
			<Navbar />
			{children}
			<Footer />
		</>
	);
}
