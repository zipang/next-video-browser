"use client";

import { PlayerStateProvider, type Video } from "./components/PlayerStateProvider";
import { VideoGallery } from "./components/VideoGallery";

// Sample video data (could be result of external API call)
import videos from "./videos.json";

const Page = () => (
	<PlayerStateProvider playlist={videos}>
		<VideoGallery videos={videos} />
	</PlayerStateProvider>
);

export default function Home() {
	return (
		<main>
			<Page />
		</main>
	);
}
