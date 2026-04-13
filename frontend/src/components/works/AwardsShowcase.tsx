export default function AwardsShowcase() {
	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-350 border-dashed py-12 min-[1400px]:border-x min-[1800px]:max-w-384">
				<div className="mx-auto flex flex-col items-center text-center">
					<h2 className="max-w-4xl text-center text-2xl leading-tight font-bold text-neutral-800 sm:text-3xl md:text-4xl lg:text-4xl dark:text-neutral-100">Winning Solutions That Drive Results</h2>

					<p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-700 md:text-base dark:text-neutral-400">Recognized for delivering innovative digital experiences that combine stunning design with powerful functionality. Our portfolio reflects a commitment to excellence across every project we undertake.</p>
				</div>
				<div className="mx-auto w-full max-w-7xl">
					<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
						<div className="flex flex-col items-center border border-dashed p-6">
							<h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Best UX Design</h3>
							<p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">Awarded for creating intuitive and engaging user experiences that delight users and drive engagement.</p>
						</div>
						<div className="flex flex-col items-center border border-dashed p-6">
							<h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Innovation in Technology</h3>
							<p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">Recognized for leveraging cutting-edge technologies to deliver innovative solutions that solve complex challenges.</p>
						</div>
						<div className="flex flex-col items-center border border-dashed p-6">
							<h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Excellence in Design</h3>
							<p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">Honored for crafting visually stunning designs that elevate brands and create memorable digital experiences.</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
