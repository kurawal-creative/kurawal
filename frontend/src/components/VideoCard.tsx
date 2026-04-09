const VideoCard = ({ src, title, desc, badges = [] }: { src: string; title: string; desc: string; badges?: string[] }) => {
	return (
		<div className="group relative h-full w-full overflow-hidden rounded-xs">
			{/* VIDEO */}
			<video
				src={src}
				muted
				loop
				disablePictureInPicture
				controlsList="nodownload nofullscreen noremoteplayback"
				playsInline
				className="h-80 w-full object-cover transition-all duration-700 group-hover:scale-105"
				onMouseEnter={(e) => e.currentTarget.play()}
				onMouseLeave={(e) => {
					e.currentTarget.pause();
					e.currentTarget.currentTime = 0;
				}}
			/>

			<div className="pointer-events-none absolute inset-0 bg-black/10 transition-all duration-500 group-hover:bg-black/40"></div>

			<div className="absolute bottom-0 left-0 flex w-full flex-col p-4 transition-all duration-500">
				<h2 className="text-start text-xl font-semibold text-white drop-shadow-md transition-all duration-500 group-hover:-translate-y-2">{title}</h2>
				<p className="max-w-sm translate-y-2 text-start text-sm text-white/80 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">{desc}</p>
			</div>

			{/* Badge */}
			<div className="absolute top-0 right-0 flex flex-wrap gap-2 p-4">
				{badges.map((badge, i) => (
					<span key={i} className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
						{badge}
					</span>
				))}
			</div>
		</div>
	);
};

export default VideoCard;
