"use client";

import { type FC, createElement, useRef, useEffect } from "react";
import { usePlayerState } from "@components/PlayerStateProvider";
import { VideoOverlay } from "./VideoOverlay";
import "youtube-video-element";
import "vimeo-video-element";

// Extend JSX.IntrinsicElements for custom video elements
declare global {
	namespace JSX {
		interface IntrinsicElements {
			"youtube-video": React.DetailedHTMLProps<
				React.VideoHTMLAttributes<HTMLVideoElement>,
				HTMLVideoElement
			>;
			"vimeo-video": React.DetailedHTMLProps<
				React.VideoHTMLAttributes<HTMLVideoElement>,
				HTMLVideoElement
			>;
			"cloudflare-video": React.DetailedHTMLProps<
				React.VideoHTMLAttributes<HTMLVideoElement>,
				HTMLVideoElement
			>;
		}
	}
}

interface VideoPlayerConfig {
	element: "cloudflare-video" | "youtube-video" | "vimeo-video" | "video";
	config?: Record<string, any>;
}

// --- VideoPlayer Component ---
export interface VideoPlayerProps {
	src: string;
	width: string | number;
	height: string | number;
}

const getVideoPlayerFor = (src: string): VideoPlayerConfig => {
	if (/youtu/.test(src)) {
		return {
			element: "youtube-video",
			config: {
				disablekb: 0,
				rel: 0,
				fs: 1
			}
		};
	}

	if (/vimeo.com/.test(src)) {
		return {
			element: "vimeo-video",
			config: {}
		};
	}

	return {
		// Default to HTML5 video element
		element: "video",
		config: {}
	};
};

export const VideoPlayer: FC<VideoPlayerProps> = ({ src }) => {
	// Handle to the video tag element
	const videoElt = useRef<HTMLVideoElement>(null);

	const { element, config } = getVideoPlayerFor(src);

	const { playing, stopPlay } = usePlayerState();

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
		<>
			{createElement(element, {
				ref: videoElt,
				src,
				className: "video-player",
				config,
				onEnded: () => stopPlay(),
				playsInline: true
			})}
			<VideoOverlay />
		</>
	);
};
