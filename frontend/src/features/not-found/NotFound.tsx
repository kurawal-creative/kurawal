import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-900">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl font-semibold text-red-600 dark:bg-red-900 dark:text-red-400">404</div>
					<CardTitle className="text-2xl">Halaman Tidak Ditemukan</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-muted-foreground mb-6">Maaf, halaman yang Anda cari tidak tersedia atau mungkin telah dipindahkan.</p>
					<Button asChild className="w-full">
						<Link to="/">
							<Home className="mr-2 h-4 w-4" />
							Kembali ke Beranda
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
