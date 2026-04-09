import { BackgroundRippleEffect } from "../ui/background-ripple-effect";
import { Highlighter } from "../ui/highlighter";

const AboutHero = () => {
	return (
		<section className="relative mx-auto -mt-14 min-h-[60vh] w-full max-w-[1400px] border-dashed px-0.5 pb-12 min-[1400px]:border-x min-[1800px]:max-w-[1536px]">
			{/* Background Ripple */}
			<BackgroundRippleEffect />

			{/* Content */}
			<div className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
				<div className="z-10">
					<h2 className="max-w-4xl text-2xl leading-tight font-bold text-neutral-800 sm:text-3xl md:text-4xl lg:text-5xl dark:text-neutral-100">
						We are{" "}
						<Highlighter action="underline" color="">
							Kurawal
						</Highlighter>
					</h2>
					<p className="mx-auto mt-5 max-w-xl text-sm text-neutral-700 md:text-base dark:text-neutral-400">A team of passionate developers and designers dedicated to building digital experiences that matter.</p>
				</div>
			</div>
		</section>
	);
};

export default AboutHero;
