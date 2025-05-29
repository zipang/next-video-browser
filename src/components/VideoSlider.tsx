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
	<div key={`${video.id}`} className={`vignette video-${video.id}`} tabIndex={0}>
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
						createRoot(parent).render(<Vignette video={video} />);
					},

					width: 240,
					height: video.height
				};
			},
			onSlideSelect: (index) => {
				const video = videos[index];
				setSelectedVideo(video);
				return "active";
			}
		});
	}, []);

	return (
		<Box
			as="nav"
			className="videos"
			height="100vh"
			width="240px"
			backgroundColor="#18181b"
			overflow="hidden"
			position="relative"
			zIndex="10"
			ref={target}
		/>
	);
};
