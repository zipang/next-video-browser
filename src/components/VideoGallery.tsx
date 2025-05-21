"use client";

import { useState, type FC } from "react";
import {
	Flex,
	Text,
	Heading,
	Link,
	VStack,
	HStack,
	Grid,
	GridItem,
	useSafeLayoutEffect
} from "@chakra-ui/react";
import { useDisclosure } from "@hooks/use-disclosure";
import { DownloadIcon } from "@icons/download-icon";
import { Drawer } from "@components/base/Drawer";
import { VideoPlayer } from "./VideoPlayer";
import { VideoSlider } from "./VideoSlider";
import type { Video } from "./PlayerStateProvider";

export interface VideoGalleryProps {
	videos: Video[];
}

export const VideoGallery: FC<VideoGalleryProps> = ({ videos }) => {
	const [selectedVideo, setSelectedVideo] = useState(videos[0]);
	const [isPanelOpen, toggleDrawer, openDrawer, closeDrawer] = useDisclosure({
		defaultOpen: false
	});

	useSafeLayoutEffect(() => {
		/**
		 * Open the drawer after a short delay to allow for smooth transitions.
		 */
		setTimeout(() => openDrawer(), 1000);
	}, []);

	return (
		<main>
			{/* Video Launcher - Left Side */}
			<Drawer
				placement="left"
				isOpen={isPanelOpen}
				close={closeDrawer}
				open={openDrawer}
				toggle={toggleDrawer}
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
					as="section"
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
