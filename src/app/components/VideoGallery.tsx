"use client";

import { useState, useRef, useEffect, type FC } from "react";
import {
	Box,
	Center,
	Flex,
	Text,
	Heading,
	Button,
	Link,
	VStack,
	HStack,
	Grid,
	GridItem
} from "@chakra-ui/react";
import Image from "next/image";
import { clsx } from "clsx";
import { useDisclosure } from "@hooks/use-disclosure";
import { DownloadIcon } from "@icons/download-icon";
import { VideoPlayer } from "./VideoPlayer";
import type { Video } from "./PlayerStateProvider";

import "./video-gallery-styles.css";
import { Drawer } from "./base/Drawer";

export interface VideoGalleryProps {
	videos: Video[];
}

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

const VideoSlider: FC<VideoSliderProps> = ({
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

export const VideoGallery: FC<VideoGalleryProps> = ({ videos }) => {
	const [selectedVideo, setSelectedVideo] = useState(videos[0]);
	const [isPanelOpen, togglePanel, closePanel, openPanel] = useDisclosure({
		defaultOpen: true
	});

	return (
		<main>
			{/* Video Launcher - Left Side */}
			<Drawer
				placement="left"
				isOpen={isPanelOpen}
				onClose={closePanel}
				onOpen={openPanel}
				onToggle={togglePanel}
				showOverlay={true}
				showHandler={true}
			>
				<VideoSlider
					videos={videos}
					selectedVideo={selectedVideo}
					setSelectedVideo={setSelectedVideo}
				/>
			</Drawer>

			{/* Main Content Area */}
			<Flex
				flex="1"
				flexDirection="column"
				height="100vh"
				overflowY="auto"
				bg="brand.900"
				transition="margin-left 0.3s ease"
			>
				{/* Video Player Section */}
				<VideoPlayer width="100%" height="70vh" src={selectedVideo.src} />

				{/* Video Information Section */}
				<Grid
					templateColumns="repeat(2, 1fr)"
					ml="240px"
					gap={8}
					padding="8"
					bg="brand.900"
				>
					{/* Left Column - Title and Description */}
					<GridItem>
						<VStack align="flex-start">
							<Heading size="2xl" fontWeight="900">
								{selectedVideo.title}
							</Heading>
							<Text fontSize="xl" color="gray.400">
								Duration: {selectedVideo.duration}
							</Text>
							<Text fontSize="xl" lineHeight="1.8">
								{selectedVideo.description}
							</Text>
						</VStack>
					</GridItem>

					{/* Right Column - Additional Resources */}
					<GridItem>
						<VStack align="flex-start">
							<Heading size="xl">Resources</Heading>

							<ul className="ressources">
								{selectedVideo.resources.length > 0 ? (
									selectedVideo.resources.map((resource, index) => (
										<HStack as="li" key={`ressource-${index}`}>
											<DownloadIcon />
											<Link
												href={resource.url}
												fontSize="xl"
												fontWeight="400"
												_hover={{ textDecoration: "underline" }}
											>
												{resource.name} (PDF)
											</Link>
										</HStack>
									))
								) : (
									<Text fontSize="xl" color="gray.500">
										No resources available
									</Text>
								)}
							</ul>
						</VStack>
					</GridItem>
				</Grid>
			</Flex>
		</main>
	);
};
