"use client";

import { type FC, useRef, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { usePlayerState } from "./PlayerStateProvider";

// --- Internal PlayButton component ---
const PlayButton = () => (
	<Box
		width="0"
		height="0"
		borderLeft="50px solid white"
		borderTop="30px solid transparent"
		borderBottom="30px solid transparent"
		transform="translateX(10px)"
	/>
);

// --- Internal VideoPlayerOverlay component ---
interface VideoPlayerOverlayProps {
	playing: boolean;
	onClick: () => void;
}

const VideoPlayerOverlay: FC<VideoPlayerOverlayProps> = ({ playing, onClick }) => (
	<Flex
		position="absolute"
		top="0"
		left="0"
		width="100%"
		height="100%"
		justifyContent="center"
		alignItems="center"
		bg={playing ? "transparent" : "rgba(0,0,0,0.3)"} // Transparent when playing
		cursor="pointer"
		onClick={onClick} // Always clickable
	>
		{!playing && <PlayButton />} {/* Show button only when paused */}
	</Flex>
);

// --- VideoPlayer Component ---
export interface VideoPlayerProps {
	src: string;
	width: string | number;
	height: string | number;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({ src, width, height }) => {
	// Handle to the video tag element
	const videoElt = useRef<HTMLVideoElement>(null);

	const { playing, togglePlay, stopPlay } = usePlayerState();

	// Effect to control actual video element play/pause based on isPlaying prop or src change
	useEffect(() => {
		if (videoElt.current) {
			if (playing) {
				videoElt.current
					.play()
					.catch((error) => console.error("Video play failed:", error));
			} else {
				videoElt.current.pause();
			}
		}
	}, [playing]); // Re-evaluate if isPlaying or src changes

	// Effect to reset video (e.g., currentTime) when src changes
	useEffect(() => {
		if (videoElt.current) {
			videoElt.current.pause();
			videoElt.current.currentTime = 0;
		}
	}, [src]);

	return (
		<Box as="section" width={width} height={height} position="relative" bg="black">
			<Box
				as="video"
				ref={videoElt}
				src={src}
				width="100%"
				height="100%"
				objectFit="contain"
				onEnded={() => stopPlay()}
				playsInline // Recommended for mobile browsers
			/>
			<VideoPlayerOverlay playing={playing} onClick={togglePlay} />
		</Box>
	);
};
