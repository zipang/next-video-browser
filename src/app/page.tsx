"use client";

import { PlayerStateProvider, type Video } from "@components/PlayerStateProvider";
import { VideoGallery } from "@components/VideoGallery";

// Sample video data (could be result of external API call)
import videos from "./videos.json";

const HomePage = () => (
	<PlayerStateProvider playlist={videos}>
		<VideoGallery videos={videos} />
	</PlayerStateProvider>
);

export default HomePage;
