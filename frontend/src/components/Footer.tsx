import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import logoLight from "@/assets/svg/logo-light-mode.svg";
import logoDark from "@/assets/svg/logo-dark-mode.svg";
import { useEffect, useState } from "react";

export function Footer() {
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

	const company = [
		{
			title: "About Us",
			href: "#",
		},
		{
			title: "Careers",
			href: "#",
		},
		{
			title: "Brand assets",
			href: "#",
		},
		{
			title: "Privacy Policy",
			href: "#",
		},
		{
			title: "Terms of Service",
			href: "#",
		},
	];

	const resources = [
		{
			title: "Blog",
			href: "#",
		},
		{
			title: "Help Center",
			href: "#",
		},
		{
			title: "Contact Support",
			href: "#",
		},
		{
			title: "Community",
			href: "#",
		},
		{
			title: "Security",
			href: "#",
		},
	];

	const socialLinks = [
		{
			icon: FacebookIcon,
			link: "#",
		},
		{
			icon: GithubIcon,
			link: "#",
		},
		{
			icon: InstagramIcon,
			link: "#",
		},
		{
			icon: LinkedinIcon,
			link: "#",
		},
		{
			icon: TwitterIcon,
			link: "#",
		},
	];
	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<footer className="relative mx-auto max-w-[1400px] border-dashed pt-12 min-[1400px]:border-x min-[1800px]:max-w-[1536px]">
				<div className="grid grid-cols-6 gap-6 p-4">
					<div className="col-span-6 flex flex-col gap-4 pt-5 md:col-span-4">
						<Link className="w-max" to="#">
							<img src={isDarkMode ? logoDark : logoLight} alt="Logo" className="h-4 w-auto md:h-5" />
						</Link>
						<p className="text-muted-foreground max-w-sm font-mono text-sm text-balance">A comprehensive financial technology platform.</p>
						<div className="flex gap-2">
							{socialLinks.map((item, index) => (
								<Button key={`social-${item.link}-${index}`} size="sm" variant="outline" asChild>
									<Link to={item.link} target="_blank" rel="noopener noreferrer">
										<item.icon className="size-3.5" />
									</Link>
								</Button>
							))}
						</div>
					</div>
					<div className="col-span-3 w-full md:col-span-1">
						<span className="text-muted-foreground text-xs">Resources</span>
						<div className="mt-2 flex flex-col gap-2">
							{resources.map(({ href, title }) => (
								<Link className="w-max text-sm hover:underline" to={href} key={title}>
									{title}
								</Link>
							))}
						</div>
					</div>
					<div className="col-span-3 w-full md:col-span-1">
						<span className="text-muted-foreground text-xs">Company</span>
						<div className="mt-2 flex flex-col gap-2">
							{company.map(({ href, title }) => (
								<Link className="w-max text-sm hover:underline" to={href} key={title}>
									{title}
								</Link>
							))}
						</div>
					</div>
				</div>

				<hr className="-mb-px w-full border-dashed" />

				<div className="flex flex-col justify-between gap-2 py-6">
					<p className="text-muted-foreground text-center text-sm font-light">&copy; {new Date().getFullYear()} kurawal, All rights reserved</p>
				</div>
			</footer>
			<hr className="-mb-px w-full border-dashed" />
		</>
	);
}
