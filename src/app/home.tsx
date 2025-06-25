"use client";

import { PlayerStateProvider } from "@components/PlayerStateProvider";
import { VideoGallery } from "@components/VideoGallery";
import { EventBusProvider } from "@components/EventBusProvider";

import videosJson from "./videos.json";
import { validateVideos } from "./videos-schema";

const videos = validateVideos(videosJson);

const HomePage = () => (
	<EventBusProvider>
		<PlayerStateProvider playlist={videos}>
			<VideoGallery />
		</PlayerStateProvider>
	</EventBusProvider>
);

export default HomePage;
