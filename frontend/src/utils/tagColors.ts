// Generate consistent, unique color for each tag based on its name
export function generateTagColor(tagName: string): string {
	// Hash function to convert string to number
	let hash = 0;
	for (let i = 0; i < tagName.length; i++) {
		hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash; // Convert to 32bit integer
	}

	// Predefined color palette with good contrast and readability
	const colorPalette = [
		{ bg: "bg-blue-500/10", text: "text-blue-600", darkText: "dark:text-blue-500" },
		{ bg: "bg-purple-500/10", text: "text-purple-600", darkText: "dark:text-purple-500" },
		{ bg: "bg-pink-500/10", text: "text-pink-600", darkText: "dark:text-pink-500" },
		{ bg: "bg-red-500/10", text: "text-red-600", darkText: "dark:text-red-500" },
		{ bg: "bg-orange-500/10", text: "text-orange-600", darkText: "dark:text-orange-500" },
		{ bg: "bg-amber-500/10", text: "text-amber-600", darkText: "dark:text-amber-500" },
		{ bg: "bg-yellow-500/10", text: "text-yellow-600", darkText: "dark:text-yellow-600" },
		{ bg: "bg-lime-500/10", text: "text-lime-600", darkText: "dark:text-lime-500" },
		{ bg: "bg-green-500/10", text: "text-green-600", darkText: "dark:text-green-500" },
		{ bg: "bg-emerald-500/10", text: "text-emerald-600", darkText: "dark:text-emerald-500" },
		{ bg: "bg-teal-500/10", text: "text-teal-600", darkText: "dark:text-teal-500" },
		{ bg: "bg-cyan-500/10", text: "text-cyan-600", darkText: "dark:text-cyan-500" },
		{ bg: "bg-sky-500/10", text: "text-sky-600", darkText: "dark:text-sky-500" },
		{ bg: "bg-indigo-500/10", text: "text-indigo-600", darkText: "dark:text-indigo-500" },
		{ bg: "bg-violet-500/10", text: "text-violet-600", darkText: "dark:text-violet-500" },
		{ bg: "bg-fuchsia-500/10", text: "text-fuchsia-600", darkText: "dark:text-fuchsia-500" },
		{ bg: "bg-rose-500/10", text: "text-rose-600", darkText: "dark:text-rose-500" },
	];

	// Use hash to pick a color from palette
	const index = Math.abs(hash) % colorPalette.length;
	const color = colorPalette[index];

	return `${color.bg} ${color.text} ${color.darkText} hover:${color.bg.replace("/10", "/20")}`;
}

// Generate hex color code for backend storage (optional)
export function generateTagColorHex(tagName: string): string {
	let hash = 0;
	for (let i = 0; i < tagName.length; i++) {
		hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Generate vibrant colors with good saturation
	const hue = Math.abs(hash) % 360;
	const saturation = 65 + (Math.abs(hash >> 8) % 20); // 65-85%
	const lightness = 55 + (Math.abs(hash >> 16) % 15); // 55-70%

	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
