import { CardStackGrid } from "../CardsStackGrid";
import { CodeDummy } from "../CodeDummy";
import { OrbitingCirclesGrid } from "../OrbitingCircles";
import { Highlighter } from "../ui/highlighter";
import { motion } from "framer-motion";

import cethaDemo from "@/assets/images/cetha-demo.png";
import cethaJob from "@/assets/images/cetha-jobs.png";
import cethaRecomendation from "@/assets/images/cetha-recomendation.png";

const FeaturesSection = () => {
	return (
		<>
			<hr className="-mb-px w-full border-dashed" />
			<section className="relative mx-auto max-w-[1400px] border-dashed py-12 min-[1400px]:border-x min-[1800px]:max-w-[1536px]">
				<div className="z-10 mx-auto text-center">
					<p className="font-caveat text-xl text-neutral-800 dark:text-neutral-100">
						<Highlighter action="underline" color="" padding={2} strokeWidth={1} iterations={2}>
							Differentiating Feature
						</Highlighter>
					</p>

					<div className="mx-auto mt-5 flex flex-col items-center text-center">
						<h2 className="max-w-4xl text-center text-2xl leading-tight font-bold text-neutral-800 sm:text-3xl md:text-4xl lg:text-4xl dark:text-neutral-100">Your Vision, Built With Precision</h2>
						<p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-700 md:text-base dark:text-neutral-400">From thoughtful design to robust development, we craft solutions that are intentional, effective, and built to last.</p>
					</div>

					<div className="mt-12 grid grid-cols-1 overflow-hidden border-t border-dashed md:grid-cols-2">
						<div className="relative col-span-1 overflow-hidden border-b border-dashed p-0.5 md:col-span-2">
							<div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
								<div className="order-1 flex-1 p-6 lg:order-1">
									<h2 className="text-start text-2xl font-bold text-neutral-800 dark:text-neutral-100">Any Stack. Any Vision. One Team.</h2>
									<p className="mt-4 text-start text-neutral-600 dark:text-neutral-400">We bring your wildest ideas to life using the exact tools you love — Next.js, Remix, Nuxt, Laravel, Node, Flutter, or anything bleeding-edge. Scalable, secure, lightning-fast, and launched on time.</p>
								</div>
								<div className="order-2 flex justify-center lg:order-2">
									<div className="relative w-full max-w-md py-0.5 lg:py-0">
										<OrbitingCirclesGrid />
										<div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-linear-to-b from-white to-transparent dark:from-neutral-950" />
										<div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-white to-transparent dark:from-neutral-950" />
										<div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-white to-transparent dark:from-neutral-950" />
										<div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-white to-transparent dark:from-neutral-950" />
									</div>
								</div>
							</div>
						</div>

						<div className="relative col-span-1 overflow-hidden border-b border-dashed p-0.5 md:col-span-2">
							<div className="flex flex-col items-center md:pb-18 lg:flex-row lg:py-12">
								<div className="order-2 flex-1 lg:order-1">
									<div className="mx-auto mt-8 mr-14 md:mr-0 lg:mt-0">
										<CardStackGrid />
										<div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-b from-white to-transparent dark:from-neutral-950" />
									</div>
								</div>

								<div className="order-1 flex-1 p-6 lg:order-2">
									<h2 className="text-start text-2xl font-bold text-neutral-800 dark:text-neutral-100">You Own Every Line of Code</h2>
									<p className="mt-4 text-start text-neutral-600 dark:text-neutral-400">No black boxes, no lock-in, no hidden sauce. We build with battle tested, open tools Tailwind, Next.js, Prisma, Vercel and hand you clean, production-ready code you can run, extend, or sell tomorrow.</p>
								</div>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-1 overflow-hidden border-b border-dashed lg:grid-cols-2">
						<div className="col-span-1 grid overflow-hidden border-b border-dashed p-0.5 md:border-r">
							<div className="px-6 pt-6">
								<h2 className="text-start text-2xl font-bold text-neutral-800 dark:text-neutral-100">We Make Your Website Think</h2>
								<p className="mt-4 text-start text-neutral-600 dark:text-neutral-400">Smart chat, personalized journeys, predictive search, and AI automation turning every visitor into a loyal customer.</p>
							</div>
							<div className="relative p-6">
								<div className="relative pb-12 md:pb-0">
									<motion.img
										src={cethaDemo}
										alt="cetha demo"
										className="rounded-sm border"
										animate={{ y: [0, -10, 0] }}
										transition={{
											duration: 4,
											repeat: Infinity,
											ease: "easeInOut",
										}}
									/>

									<motion.div
										className="absolute -translate-y-1/2 -rotate-12 rounded-sm border md:top-60 md:-left-2"
										animate={{ y: [0, -12, 0] }}
										transition={{
											duration: 5,
											repeat: Infinity,
											ease: "easeInOut",
											delay: 0.5,
										}}
									>
										<img src={cethaJob} alt="cetha hasil" className="w-20 rounded-sm md:w-25" />
									</motion.div>

									<motion.div
										className="absolute top-37 right-0 -translate-y-1/2 rotate-12 rounded-sm border md:top-5 md:-right-2"
										animate={{ y: [0, -8, 0] }}
										transition={{
											duration: 4.5,
											repeat: Infinity,
											ease: "easeInOut",
											delay: 1,
										}}
									>
										<img src={cethaRecomendation} alt="cetha hasil" className="w-30 rounded-sm md:w-40" />
									</motion.div>
								</div>
							</div>
						</div>
						<div className="col-span-1 grid overflow-hidden p-0.5">
							<div className="flex-col">
								<div className="flex-1">
									<div className="p-6">
										<h2 className="text-start text-2xl font-bold text-neutral-800 dark:text-neutral-100">Beautiful Outside. Bulletproof Inside.</h2>
										<p className="mt-4 text-start text-neutral-600 dark:text-neutral-400">Every line of code is written like it's going to be studied in a museum. Performant, maintainable, and built to evolve with your company for the next decade.</p>
									</div>
								</div>
								<div className="p-6 text-start">
									<CodeDummy duration={200} delay={0} writing={true} cursor={true} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default FeaturesSection;
