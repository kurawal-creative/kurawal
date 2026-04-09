import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

const ThemeToggler = () => {
	return (
		<span className="rounded-md">
			<AnimatedThemeToggler className="flex items-center justify-center rounded-md p-2 text-neutral-800 transition hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800" />
		</span>
	);
};

export default ThemeToggler;
