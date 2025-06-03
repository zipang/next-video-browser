import type { DetailedHTMLProps, HTMLAttributes, FC } from "react";
import type { VideoPlayerProps } from "./VideoPlayer";

// This library registers the custom HTML element <youtube-video>
const lib = import("youtube-video-element").catch();

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"youtube-video": DetailedHTMLProps<
				HTMLAttributes<HTMLVideoElement>,
				HTMLVideoElement
			>;
		}
	}
}
export const YoutubePlayer: FC<VideoPlayerProps> = (props) => (
	/** @ts-ignore unknown JSX IntrinsicElements */
	<youtube-video {...props} />
);

export default YoutubePlayer;
