"use client";

import { useRef, useEffect, type FC } from "react";
import { Box, Center, Text } from "@chakra-ui/react";
import Image from "next/image";
import { clsx } from "clsx";
import type { Video } from "./PlayerStateProvider";

import "./video-slider-styles.css";

interface VignetteProps {
	video: Video;
	active: boolean;
	onSelection: (vid: Video) => void;
}

const Vignette: FC<VignetteProps> = ({ video, active, onSelection }) => (
	<Center
		key={`${video.id}`}
		className={clsx("vignette", active && "active")}
		cursor="pointer"
		onClick={() => onSelection(video)}
		padding="2"
		position="relative"
		tabIndex={0}
	>
		<Image alt={video.title} src={video.thumbnail} width="240" height="180" />
		<Text position="absolute" color="white" textAlign="center">
			Ep#{video.id}
			<br />
			{video.title}
		</Text>
	</Center>
);

interface VideoSliderProps {
	videos: Video[];
	selectedVideo: Video;
	setSelectedVideo: (vid: Video) => void;
}

export const VideoSlider: FC<VideoSliderProps> = ({
	videos,
	selectedVideo,
	setSelectedVideo
}) => {
	const launcherRef = useRef<HTMLDivElement>(null);

	// Implement infinite scrolling effect for the launcher
	useEffect(() => {
		const launcher = launcherRef.current;
		if (!launcher) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = launcher;

			// If we're at the bottom, jump to the top
			if (scrollTop + clientHeight >= scrollHeight - 10) {
				launcher.scrollTop = 1;
			}

			// If we're at the top, jump to the bottom
			if (scrollTop <= 0) {
				launcher.scrollTop = scrollHeight - clientHeight - 1;
			}
		};

		launcher.addEventListener("scroll", handleScroll);
		return () => launcher.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<Box
			as="nav"
			height="100vh"
			bg="brand.800"
			overflow="hidden"
			position="relative"
			zIndex="10"
		>
			<Box
				ref={launcherRef}
				height="100%"
				backgroundColor="black"
				overflowY="scroll"
				css={{
					"&::-webkit-scrollbar": {
						width: "6px"
					},
					"&::-webkit-scrollbar-track": {
						background: "#1A1A1A"
					},
					"&::-webkit-scrollbar-thumb": {
						background: "#333333"
					},
					scrollbarWidth: "thin",
					scrollbarColor: "#333333 #1A1A1A"
				}}
				paddingY="2"
			>
				{/* Duplicate videos at the beginning and end for infinite scroll effect */}
				{[...videos, ...videos].map((video, index) => (
					<Vignette
						video={video}
						active={selectedVideo.id === video.id}
						onSelection={setSelectedVideo}
						key={`${video.id}-${index}`}
					/>
				))}
			</Box>
		</Box>
	);
};
