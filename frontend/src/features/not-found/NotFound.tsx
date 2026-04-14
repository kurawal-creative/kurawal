import { Link } from "react-router-dom";

import notFoundImage from "@/assets/images/not-found-image.png";

export default function NotFound() {
	return (
		<section className="flex min-h-screen w-full flex-col items-center justify-center px-4 text-center">
			<img src={notFoundImage} alt="404 Not Found" width={400} height={300} />

			<div className="space-y-0.5">
				<h2 className="text-2xl font-bold text-neutral-800">Halaman tidak ditemukan</h2>

				<p className="max-w-md text-neutral-600">Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau URL yang dimasukkan tidak tepat.</p>
			</div>
			<Link to="/" className="mt-4 rounded-full text-lg font-semibold text-neutral-800 underline underline-offset-3 transition hover:text-neutral-600">
				kembali ke beranda
			</Link>
		</section>
	);
}
