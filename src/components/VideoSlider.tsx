import { Box, useSafeLayoutEffect } from "@chakra-ui/react";
import { useRef, type FC } from "react";
import { createRoot } from "react-dom/client";
import Image from "next/image";
import type { Video } from "./PlayerStateProvider";
import { VerticalSlider } from "./VerticalSlider";

import "./video-slider-styles.css";

interface VignetteProps {
	video: Video;
	skeleton?: boolean;
}

const Vignette: FC<VignetteProps> = ({ video, skeleton = false }) => (
	<div
		key={`${video.id}`}
		className={`vignette video-${video.id}`}
		data-video-index={video.id}
		tabIndex={0}
	>
		{!skeleton && (
			<Image
				alt={video.title}
				src={video.thumbnail}
				height={video.height}
				width="240"
				loading="eager"
			/>
		)}
		<p>
			Ep#{video.id}
			<br />
			{video.title}
		</p>
	</div>
);

interface VideoSliderProps {
	videos: Video[];
	setSelectedVideo: (vid: Video) => void;
}

export const VideoSlider: FC<VideoSliderProps> = ({ videos, setSelectedVideo }) => {
	const target = useRef<HTMLDivElement>(null);
	const slider = useRef<VerticalSlider>(null);

	const handleMouseWheel = (event: React.WheelEvent<HTMLDivElement>) => {
		slider.current?.animate(-event.deltaY * 11);
	};

	const handleSelectVideo = (event: React.MouseEvent<HTMLDivElement>) => {
		slider.current?.stop();
		// Find the closest vignette element to the clicked target
		const targetElement = event.target as HTMLElement;
		const vignetteElement = targetElement.closest(".vignette");
		const videoIndex = Number.parseInt(
			vignetteElement?.getAttribute("data-video-index") || "",
			10
		);
		if (vignetteElement && !Number.isNaN(videoIndex)) {
			const video = videos[videoIndex - 1]; // Adjust for 0-based index
			setSelectedVideo(video);
			document.querySelectorAll(".vignette").forEach((el) => {
				el.classList.remove("active");
			});
			vignetteElement.classList.add("active");
			console.log("Selected video:", video.title);
		}
	};

	// Initialize the slider when the component mounts
	useSafeLayoutEffect(() => {
		slider.current = new VerticalSlider({
			target: target.current as HTMLDivElement,
			count: videos.length,
			damping: 0.99,
			width: 240,
			getSlide: (index) => {
				const video = videos[index % videos.length];
				return {
					render: (parent: HTMLElement) => {
						const root = createRoot(parent);
						root.render(<Vignette video={video} />);
						console.log("slide.render() called for video:", video.title);
					},
					width: 240,
					height: video.height
				};
			}
		});
	}, []);

	return (
		<Box
			as="nav"
			height="100vh"
			backgroundColor="#18181b"
			overflow="hidden"
			position="relative"
			zIndex="10"
			onWheel={handleMouseWheel}
			onClick={handleSelectVideo}
		>
			<div className="video-slider" ref={target} />
		</Box>
	);
};
