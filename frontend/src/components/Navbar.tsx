import { Search, Github, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

import logoLight from "@/assets/svg/logo-light-mode.svg";
import logoDark from "@/assets/svg/logo-dark-mode.svg";

const navbarItems = [
	{ title: "Projects", href: "/projects" },
	{ title: "Blog", href: "/blog" },
	{ title: "Resources", href: "/resources" },
	{ title: "About Us", href: "/about-us" },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const isDark = document.documentElement.classList.contains("dark");
		setIsDarkMode(isDark);

		const observer = new MutationObserver(() => {
			const dark = document.documentElement.classList.contains("dark");
			setIsDarkMode(dark);
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	}, []);

	return (
		<header className="sticky top-0 z-50 h-12 border-b border-dashed border-gray-300 bg-white/70 backdrop-blur-md md:h-14 dark:bg-neutral-900/70">
			<nav className="mx-auto flex h-full w-full max-w-350 items-center justify-between border-dashed px-4 min-[1400px]:border-x">
				{/* Left */}
				<div className="flex flex-1 items-center text-lg font-semibold">
					<Link to={navbarItems[0].href}>
						<img src={isDarkMode ? logoDark : logoLight} alt="Logo" className="h-4 w-auto md:h-5" />
					</Link>
				</div>

				{/* Center */}
				<ul className="hidden items-center gap-6 text-sm text-neutral-800 lg:flex dark:text-neutral-100">
					{navbarItems.map((item, index) => (
						<li key={index}>
							<Link to={item.href} className="hover:text-neutral-600 dark:hover:text-neutral-300">
								{item.title}
							</Link>
						</li>
					))}
				</ul>

				{/* Right */}
				<div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
					<button className="rounded-md p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-800">
						<Search className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
					</button>

					<ThemeToggler />

					<a href="https://github.com/kurawal-creative" target="_blank" className="rounded-md p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-800">
						<Github className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
					</a>

					<Button asChild>
						<Link to="contact-us">Contact Us</Link>
					</Button>
				</div>

				{/* Right - Tablet */}
				<div className="hidden flex-1 items-center justify-end gap-2 md:flex lg:hidden">
					<button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center rounded-md p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-800">
						{isOpen ? <X className="h-5 w-5 text-neutral-800 dark:text-neutral-100" /> : <Menu className="h-5 w-5 text-neutral-800 dark:text-neutral-100" />}
					</button>

					<button className="rounded-md p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-800">
						<Search className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
					</button>

					<ThemeToggler />

					<a href="https://github.com/KurawalCreative" className="rounded-md p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-800">
						<Github className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
					</a>

					<Button>Get Access</Button>
				</div>

				{/* Hamburger Button - Mobile Only */}
				<button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center rounded-md p-2 transition hover:bg-neutral-100 md:hidden dark:hover:bg-neutral-800">
					{isOpen ? <X className="h-5 w-5 text-neutral-800 dark:text-neutral-100" /> : <Menu className="h-5 w-5 text-neutral-800 dark:text-neutral-100" />}
				</button>
			</nav>

			{/* Mobile Menu - Full */}
			{isOpen && (
				<div className="border-b border-dashed border-gray-300 bg-white/70 backdrop-blur-md md:hidden dark:bg-neutral-900/70">
					<div className="mx-auto max-w-350 bg-white/70 px-4 py-4 backdrop-blur-md dark:bg-neutral-900/70">
						{/* Navigation Links */}
						<ul className="mb-4 space-y-3 border-b border-dashed border-gray-300 pb-4 text-end">
							{navbarItems.map((item, index) => (
								<li key={index}>
									<Link to={item.href} className="block text-sm text-neutral-800 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300" onClick={() => setIsOpen(false)}>
										{item.title}
									</Link>
								</li>
							))}
						</ul>

						{/* Action Buttons */}
						<div className="flex flex-col gap-3">
							<div className="flex items-center justify-end gap-3">
								<button className="rounded-md p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-800">
									<Search className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
								</button>

								<ThemeToggler />

								<a href="https://github.com/KurawalCreative" className="rounded-md p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-800">
									<Github className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
								</a>
							</div>

							<Button>Get Access</Button>
						</div>
					</div>
				</div>
			)}

			{/* Tablet Menu (md to lg) - Only Navigation Links */}
			{isOpen && (
				<div className="hidden border-b border-dashed border-gray-300 bg-white/70 backdrop-blur-md md:block lg:hidden dark:bg-neutral-900/70">
					<div className="mx-auto max-w-350 px-4 py-4 text-end">
						<ul className="space-y-3">
							{navbarItems.map((item, index) => (
								<li key={index}>
									<Link to={item.href} className="block text-sm text-neutral-800 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300" onClick={() => setIsOpen(false)}>
										{item.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</header>
	);
}
