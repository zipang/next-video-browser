"use client";

import { PlayerStateProvider } from "@components/PlayerStateProvider";
import { VideoGallery } from "@components/VideoGallery";
import { validateVideos } from "./videos-schema";
import videosJson from "./videos.json";

const videos = validateVideos(videosJson);

const HomePage = () => (
	<PlayerStateProvider playlist={videos}>
		<VideoGallery />
	</PlayerStateProvider>
);

export default HomePage;
