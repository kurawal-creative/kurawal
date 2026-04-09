import { useEffect, useState } from "react";
import { motion } from "motion/react";

let interval: any;

type Card = {
	id: number;
	name: string;
	username: string;
	designation: string;
	avatar: any;
	content: React.ReactNode;
};

export const CardStack = ({ items, offset, scaleFactor }: { items: Card[]; offset?: number; scaleFactor?: number }) => {
	const CARD_OFFSET = offset || 10;
	const SCALE_FACTOR = scaleFactor || 0.06;
	const [cards, setCards] = useState<Card[]>(items);

	useEffect(() => {
		startFlipping();

		return () => clearInterval(interval);
	}, []);
	const startFlipping = () => {
		interval = setInterval(() => {
			setCards((prevCards: Card[]) => {
				const newArray = [...prevCards]; // create a copy of the array
				newArray.unshift(newArray.pop()!); // move the last element to the front
				return newArray;
			});
		}, 5000);
	};

	return (
		<div className="relative h-60 w-60 md:h-20 md:w-120">
			{cards.map((card, index) => {
				return (
					<motion.div
						key={card.id}
						className="absolute flex h-auto w-80 flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-md shadow-black/10 md:w-120 dark:border-white/10 dark:bg-black dark:shadow-white/5"
						style={{ transformOrigin: "top center" }}
						animate={{
							top: index * -CARD_OFFSET,
							scale: 1 - index * SCALE_FACTOR,
							zIndex: cards.length - index,
						}}
					>
						{/* Header */}
						<div className="flex items-center gap-3">
							<img src={card.avatar} alt={card.username} className="h-8 w-8 rounded-full" />

							<div className="flex flex-col leading-snug">
								<div className="flex items-center gap-1">
									<p className="font-semibold text-neutral-800 dark:text-neutral-100">{card.name}</p>
								</div>

								<p className="text-start text-xs text-neutral-500 dark:text-neutral-400">@{card.username}</p>
							</div>
						</div>

						{/* Content */}
						<div className="text-start text-sm leading-relaxed font-normal text-neutral-700 dark:text-neutral-200">{card.content}</div>
					</motion.div>
				);
			})}
		</div>
	);
};
