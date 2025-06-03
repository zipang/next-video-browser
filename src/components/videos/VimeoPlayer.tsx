import type { FC } from "react";
import type { VideoPlayerProps } from "./VideoPlayer";

// This library registers the custom HTML element <vimeo-video>
// Note: We must silently catch an initialization error
// > Error: Sorry, the Vimeo Player API is not available in this browser.
const lib = import("vimeo-video-element").catch();

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"vimeo-video": React.DetailedHTMLProps<
				React.VideoHTMLAttributes<HTMLVideoElement>,
				HTMLVideoElement
			>;
		}
	}
}

export const VimeoPlayer: FC<VideoPlayerProps> = (props) => (
	/** @ts-ignore unknown JSX IntrinsicElements */
	<vimeo-video {...props} />
);

export default VimeoPlayer;
