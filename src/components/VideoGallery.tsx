"use client";

import {
	Flex,
	Text,
	Heading,
	Link,
	VStack,
	HStack,
	Grid,
	GridItem,
	useSafeLayoutEffect,
	Box
} from "@chakra-ui/react";
import { useDisclosure } from "@hooks/use-disclosure";
import { DownloadIcon } from "@icons/download-icon";
import { Drawer } from "@components/base/Drawer";
import { VideoPlayer } from "@components/videos/VideoPlayer";
import { VideoSlider } from "./VideoSlider";
import { usePlayerState } from "./PlayerStateProvider";

export const VideoGallery = () => {
	const { playlist, selectedVideo, slider } = usePlayerState();
	const [isPanelOpen, toggleDrawer, openDrawer, closeDrawer] = useDisclosure({
		defaultOpen: false
	});

	const currentVideo = playlist[selectedVideo];

	useSafeLayoutEffect(() => {
		if (slider) {
			/**
			 * Open the drawer after a short delay and scroll to the first slide.
			 */
			setTimeout(() => {
				openDrawer();
				slider.scrollToSlide(0, 2000);
			}, 1000);
		}
	}, [slider]);

	return (
		<Flex as="main" flex="1" flexDirection="column" height="100vh">
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
				<VideoSlider />
			</Drawer>

			{/* Main Content Area */}

			{/* Video Player Section */}
			<Box
				as="section"
				width="100%"
				minHeight="70vh"
				position="relative"
				bg="black"
			>
				<VideoPlayer src={currentVideo.src} />
			</Box>

			{/* Video Information Section */}
			<Grid
				as="section"
				templateColumns="repeat(2, 1fr)"
				ml="240px"
				gap={8}
				padding={8}
			>
				{/* Left Column - Title and Description */}
				<GridItem>
					<VStack align="flex-start">
						<Heading size="2xl" fontWeight="900">
							{currentVideo.title}
						</Heading>
						<Text fontSize="xl" color="gray.400">
							Duration: {currentVideo.duration}
						</Text>
						<Text fontSize="xl" lineHeight="1.8">
							{currentVideo.description}
						</Text>
					</VStack>
				</GridItem>

				{/* Right Column - Additional Resources */}
				<GridItem>
					<VStack align="flex-start">
						<Heading size="xl">Resources</Heading>

						<ul className="ressources">
							{currentVideo.resources.length > 0 ? (
								currentVideo.resources.map((resource, index) => (
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
	);
};
