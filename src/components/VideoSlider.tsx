import { Box, useSafeLayoutEffect } from "@chakra-ui/react";
import { useRef, type FC } from "react";
import { createRoot } from "react-dom/client";
import { usePlayerState, type Video } from "./PlayerStateProvider";
import { VerticalSlider } from "./VerticalSlider";
import { Image } from "./base/Image";

import "./video-slider-styles.css";

interface VignetteProps {
	video: Video;
	skeleton?: boolean;
}

const Vignette: FC<VignetteProps> = ({ video, skeleton = false }) => (
	<div key={`${video.id}`} className={`vignette video-${video.id}`}>
		{!skeleton && (
			<Image
				alt={video.title}
				src={video.thumbnail}
				height={video.height}
				width="240"
				loading="eager"
				draggable={false}
			/>
		)}
		<p>
			Ep#{video.id}
			<br />
			{video.title}
		</p>
	</div>
);

export const VideoSlider = () => {
	const target = useRef<HTMLDivElement>(null);
	const slider = useRef<VerticalSlider>(null);
	const { playlist, selectVideo, selectedVideo, setSlider } = usePlayerState();

	// Initialize the slider when the component mounts
	useSafeLayoutEffect(() => {
		if (!slider.current) {
			console.log("Create slider");
			slider.current = new VerticalSlider({
				target: target.current as HTMLDivElement,
				count: playlist.length,
				selected: selectedVideo,
				damping: 0.985,
				width: 240,
				getSlide: (index) => {
					const video = playlist[index % playlist.length];
					return {
						render: (parent: HTMLElement) => {
							createRoot(parent).render(<Vignette video={video} />);
						},

						width: 240,
						height: video.height
					};
				},
				onSlideSelect: (index) => {
					selectVideo(index);
					return "active";
				}
			});
			setSlider(slider.current);
		}
	}, [slider]);

	return (
		<Box
			as="nav"
			className="playlist"
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
