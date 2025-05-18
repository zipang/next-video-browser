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

export interface VideoGalleryProps {
	videos: Video[];
}

export const VideoGallery: FC<VideoGalleryProps> = ({ videos }) => {
	const [selectedVideo, setSelectedVideo] = useState(videos[0]);
	const launcherRef = useRef<HTMLDivElement>(null);
	const [isPanelOpen, togglePanel] = useDisclosure({ initialState: true });

	// Handle video selection
	const handleSelectVideo = (video: (typeof videos)[0]) => {
		setSelectedVideo(video);
	};

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
		<Flex as="aside" height="100vh" overflow="hidden" position="relative">
			{/* Video Launcher - Left Side */}
			<Box
				as="nav"
				width={isPanelOpen ? "240px" : "0"}
				height="100vh"
				bg="brand.800"
				transition="width 0.3s ease"
				overflow="hidden"
				position="relative"
				zIndex="10"
			>
				<Box
					ref={launcherRef}
					height="100%"
					backgroundColor="black"
					// backgroundImage={`url(/movie.svg)`}
					// backgroundRepeat="repeat-y"
					// backgroundPosition="center"
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
					{[...videos, ...videos, ...videos].map((video, index) => (
						<Center
							key={`${video.id}-${index}`}
							className={clsx(
								"vignette",
								selectedVideo.id === video.id && "active"
							)}
							cursor="pointer"
							onClick={() => handleSelectVideo(video)}
							padding="2"
							position="relative"
						>
							<Image
								alt={video.title}
								src={video.thumbnail}
								width="240"
								height="180"
							/>
							<Text position="absolute" color="white" textAlign="center">
								Ep#{video.id}
								<br />
								{video.title}
							</Text>
						</Center>
					))}
				</Box>
			</Box>

			{/* Button to deploy the panel */}
			<Button
				position="absolute"
				left={isPanelOpen ? "240px" : "0"}
				top="50%"
				transform="translateY(-50%)"
				zIndex="20"
				height="60px"
				width="20px"
				borderRadius="0 4px 4px 0"
				bg="brand.700"
				_hover={{ bg: "brand.800" }}
				onClick={togglePanel}
				padding="0"
				transition="left 0.3s ease"
			>
				<Box
					as="span"
					display="inline-block"
					transform={isPanelOpen ? "rotate(180deg)" : "rotate(0deg)"}
					transition="transform 0.3s ease"
				>
					&#10095;
				</Box>
			</Button>

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
				<Grid templateColumns="repeat(2, 1fr)" gap={8} padding="8" bg="brand.900">
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
		</Flex>
	);
};
