import { PlayIcon } from "@components/icons/play-icon";
import { usePlayerState } from "@components/PlayerStateProvider";
import clsx from "clsx";

import "./video-overlay-styles.css";

const PlayButton = () => (
	<button type="button" className="video-play-button" aria-label="Play video">
		<PlayIcon size="10rem" color="white" />
	</button>
);

export const VideoOverlay = () => {
	const { playing, togglePlay } = usePlayerState();
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: We register the key event handler globally
		<div className={clsx("video-player-overlay", { playing })} onClick={togglePlay}>
			{!playing && <PlayButton />} {/* Show button only when paused */}
		</div>
	);
};
