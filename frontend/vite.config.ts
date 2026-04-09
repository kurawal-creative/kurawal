import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		ViteImageOptimizer({
			png: {
				quality: 70,
			},
			jpeg: {
				quality: 70,
			},
			jpg: {
				quality: 70,
			},
		}),
	],
	server: {
		proxy: {
			"/api": "http://localhost:3000",
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
		dedupe: ["react", "react-dom"],
	},
	optimizeDeps: {
		include: ["react", "react/jsx-runtime"],
	},
});
