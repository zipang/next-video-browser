"use client";

import { type FC, useRef, useEffect, Suspense, lazy } from "react";
import { usePlayerState } from "@components/PlayerStateProvider";
import { VideoOverlay } from "./VideoOverlay";
import useKeypress from "@hooks/use-keypress";

const VimeoPlayer = lazy(() => import("./VimeoPlayer"));
const YoutubePlayer = lazy(() => import("./YoutubePlayer"));

// --- VideoPlayer Component ---
export interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
	src: string;
	config?: Record<string, any>;
}

const getPlayerType = (src: string) => {
	if (/youtu/.test(src)) return "youtube";
	if (/vimeo.com/.test(src)) return "vimeo";
	return "video";
};

export const VideoPlayer: FC<VideoPlayerProps> = ({ src }) => {
	// Handle to the actual <video> tag element
	const videoElt = useRef<HTMLVideoElement>(null);
	const { playing, stopPlaying, togglePlay } = usePlayerState();

	useKeypress("Space", togglePlay);

	const playerProps = {
		ref: videoElt,
		src,
		className: "video-player",
		controls: false,
		onEnded: () => stopPlaying(),
		playsInline: true
	};

	// Effect to control actual video element play/pause based on isPlaying prop or src change
	useEffect(() => {
		if (videoElt.current) {
			if (playing) {
				videoElt.current
					.play()
					.catch((error) => console.error("Video play failed:", error));
			} else {
				videoElt.current.pause();
			}
		}
	}, [playing]);

	return (
		<Suspense>
			<VideoOverlay />
			{(() => {
				switch (getPlayerType(src)) {
					case "youtube":
						return <YoutubePlayer {...playerProps} />;
					case "vimeo":
						return <VimeoPlayer {...playerProps} />;
					default:
						return <video {...playerProps} />;
				}
			})()}
		</Suspense>
	);
};
