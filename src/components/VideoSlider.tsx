import { Box, Center, Text, useSafeLayoutEffect } from "@chakra-ui/react";
import { Virtuoso } from "react-virtuoso";
import { useRef, type FC } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import memoize from "micro-memoize";
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
	const REPEAT = 100; // Repeat the list to allow infinite wheel
	const totalVideos = videos.length * REPEAT;
	const initialIndex = totalVideos / 2;
	const virtuosoRef = useRef<any>(null);

	const cachedVignette = memoize(
		(index: number, active: boolean) => (
			<Vignette
				video={videos[index]}
				active={active}
				onSelection={setSelectedVideo}
			/>
		),
		{
			maxSize: totalVideos * 2
		}
	);

	const getVideo = (virtualIndex: number) => {
		const index = virtualIndex % videos.length;
		const video = videos[index];

		if (!video) {
			throw new Error(`Video not found for index: ${index}`);
		}
		const active = video.id === selectedVideo.id;

		return cachedVignette(index, active);
	};

	// Center the initial vignette on mount
	useSafeLayoutEffect(() => {
		virtuosoRef.current.scrollToIndex({
			index: initialIndex,
			align: "center",
			behavior: "smooth",
			offset: 200
		});
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
			<Virtuoso
				className="video-slider"
				ref={virtuosoRef}
				style={{ height: "100vh", width: "240px", background: "#18181b" }}
				overscan={{ main: 2, reverse: 2 }}
				totalCount={totalVideos}
				initialTopMostItemIndex={initialIndex}
				itemContent={getVideo}
			/>
		</Box>
	);
};
