import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function TestProgress() {
	useEffect(() => {
		document.title = "Test Progress - Kurawal";
		return () => {
			document.title = "Vite + React";
		};
	}, []);

	// Render a very tall page so the scroll-based progress bar is visible
	const items = Array.from({ length: 120 }, (_, i) => i + 1);

	return (
		<div className="container mx-auto p-6">
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Test Progress Bar</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">Use this page to test the top progress bar. Scroll down and back up to observe progress.</p>
				</CardContent>
			</Card>

			<div className="space-y-4">
				{items.map((n) => (
					<Card key={n}>
						<CardHeader>
							<CardTitle className="text-lg">Section {n}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">This is a long content block to make the page scrollable. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
