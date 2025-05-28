import { useState, createContext, useContext, type FC, type ReactNode } from "react";

export interface VideoResource {
	name: string;
	url: string;
}

export interface Video {
	/**
	 * Index of the video in the playlist
	 */
	id: number;
	/**
	 * Title of the video
	 */
	title: string;
	/**
	 * Duration of the video
	 */
	duration: string;
	/**
	 * Longest description of the video
	 */
	description: string;
	/**
	 * Thumbnail (vignette) of the video used to select and launch it
	 */
	thumbnail: string;
	/**
	 * Height of the Vignette
	 */
	height: number;
	/**
	 * URL of the video
	 */
	src: string;
	/**
	 * List of additional ressources (PDFs)
	 */
	resources: VideoResource[];
}

export interface PlayerState {
	playlist: Video[];
	selectedVideo: number;
	playing: boolean;
}
export interface PlayerMethods {
	updatePlaylist: (playlist: Video[]) => void;
	selectVideo: (index: number) => void;
	startPlay: () => void;
	stopPlay: () => void;
	togglePlay: () => void;
}

const EMPTY_STATE = {
	playlist: [],
	selectedVideo: 0,
	playing: false
} as PlayerState;

// @ts-ignore don't pass the initial state right now
const PlayerContext = createContext<PlayerState & PlayerMethods>();

interface PlayerStateProviderProps {
	children: ReactNode;
	playlist?: Video[];
}

export const PlayerStateProvider: FC<PlayerStateProviderProps> = ({
	children,
	playlist = []
}) => {
	const [playerState, setPlayerState] = useState({ ...EMPTY_STATE, playlist });

	const updatePlaylist = (playlist: Video[]) =>
		setPlayerState({
			...playerState,
			playlist
		});

	const selectVideo = (index: number) =>
		setPlayerState({
			...playerState,
			selectedVideo: index
		});

	const togglePlay = () =>
		setPlayerState({
			...playerState,
			playing: !playerState.playing
		});

	const startPlay = () =>
		setPlayerState({
			...playerState,
			playing: true
		});

	const stopPlay = () =>
		setPlayerState({
			...playerState,
			playing: false
		});

	return (
		<PlayerContext.Provider
			value={{
				updatePlaylist,
				selectVideo,
				startPlay,
				stopPlay,
				togglePlay,
				...playerState
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export default PlayerStateProvider;

/**
 * usePlayerState() Hook
 * @return {PlayerState & PlayerMethods}
 */
export const usePlayerState = () => {
	const ps = useContext(PlayerContext);
	if (!ps) {
		throw new ReferenceError("usePlayerState() called without a PlayerStateProvider");
	}
	return ps;
};
