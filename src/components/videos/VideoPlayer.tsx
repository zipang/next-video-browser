"use client";

import { type FC, useRef, useEffect, Suspense } from "react";
import {
	MediaPlayer,
	type MediaPlayerInstance,
	MediaProvider,
	Poster,
	Track
} from "@vidstack/react";
import {
	defaultLayoutIcons,
	DefaultVideoLayout
} from "@vidstack/react/player/layouts/default";

import { usePlayerState } from "@components/PlayerStateProvider";
import { VideoOverlay } from "./VideoOverlay";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "./video-player-styles.css";

import languages from "./languages.json";
import clsx from "clsx";

// --- VideoPlayer Component ---
export interface VideoPlayerProps {
	src: string;
	poster?: string;
	subtitles?: string[];
}

const getPlayerType = (src: string) => {
	if (/youtu/.test(src)) return "youtube";
	if (/vimeo.com/.test(src)) return "vimeo";
	return "video";
};

interface TrackProps {
	src: string;
	type: "srt" | "vtt";
	lang: keyof typeof languages;
	label: string;
}

const extractSubtitlesProps = (sub: string) => {
	const [, lang, type] = sub.split(".");
	if (type !== "srt" && type !== "vtt") {
		throw new TypeError(`Unknown subtitle format : .${type}`);
	}
	const label = languages[lang as keyof typeof languages] || "transcription";
	return { src: sub, label, lang, type } as TrackProps;
};

export const VideoPlayer: FC<VideoPlayerProps> = ({ src, poster, subtitles = [] }) => {
	// Handle to the actual <video> tag element
	const player = useRef<MediaPlayerInstance>(null);
	const { playing, stopPlaying } = usePlayerState();

	const playerProps = {
		ref: player,
		src,
		className: clsx("video-player", playing && "playing"),
		controls: false,
		playsInline: true,
		onEnded: () => stopPlaying(),
		onDestroy: () => {
			if (getPlayerType(src) !== "video") {
				setTimeout(() => {
					// This call will destroy the player and all child instances.
					player.current?.destroy();
				}, 100);
			}
		}
	} as const;

	// Effect to control actual video element play/pause based on isPlaying prop or src change
	useEffect(() => {
		if (player.current) {
			if (playing) {
				player.current
					.play()
					.catch((error) => console.error("Video play failed:", error));
			} else {
				player.current.pause();
			}
		}
	}, [playing]);

	return (
		<Suspense>
			{!playing && <VideoOverlay />}
			<MediaPlayer {...playerProps}>
				{poster && <Poster className="poster" src={poster} />}
				<MediaProvider>
					{subtitles.map((sub, i) => (
						<Track
							key={sub}
							default={i === 0}
							kind="subtitles"
							{...extractSubtitlesProps(sub)}
						/>
					))}
				</MediaProvider>
				<DefaultVideoLayout icons={defaultLayoutIcons} />
			</MediaPlayer>
		</Suspense>
	);
};
