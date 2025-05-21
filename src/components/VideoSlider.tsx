import { Virtuoso } from "react-virtuoso";
import { useRef, useEffect, type FC } from "react";
import { Box, Center, Text } from "@chakra-ui/react";
import Image from "next/image";
import { clsx } from "clsx";
import type { Video } from "./PlayerStateProvider";
import "./video-slider-styles.css";

interface VignetteProps {
    video: Video;
    active: boolean;
    onSelection: (vid: Video) => void;
}

const Vignette: FC<VignetteProps> = ({ video, active, onSelection }) => (
    <Center
        key={`${video.id}`}
        className={clsx("vignette", active && "active")}
        cursor="pointer"
        onClick={() => onSelection(video)}
        padding="2"
        position="relative"
        tabIndex={0}
    >
        <Image alt={video.title} src={video.thumbnail} width="240" height="180" />
        <Text position="absolute" color="white" textAlign="center">
            Ep#{video.id}
            <br />
            {video.title}
        </Text>
    </Center>
);

interface VideoSliderProps {
    videos: Video[];
    selectedVideo: Video;
    setSelectedVideo: (vid: Video) => void;
}

export const VideoSlider: FC<VideoSliderProps> = ({
    videos,
    selectedVideo,
    setSelectedVideo
}) => {
    const REPEAT = 100; // Repeat the list to simulate infinite wheel
    const totalVideos = videos.length * REPEAT;
    const virtuosoRef = useRef<any>(null);

    // Center the scroll on mount
    useEffect(() => {
        if (virtuosoRef.current) {
            const middleIndex = Math.floor(totalVideos / 2);
            virtuosoRef.current.scrollToIndex({ index: middleIndex, align: "center" });
        }
    }, [totalVideos]);

    const getVideo = (index: number) => videos[index % videos.length];

    return (
        <Box
            as="nav"
            height="100vh"
            bg="brand.800"
            overflow="hidden"
            position="relative"
            zIndex="10"
        >
            <Virtuoso
                className="video-slider"
                ref={virtuosoRef}
                style={{ height: "100vh", width: "240px", background: "#18181b" }}
                overscan={{  main: 4, reverse: 4 }}
                totalCount={totalVideos}
                initialTopMostItemIndex={Math.floor(totalVideos / 2)}
                itemContent={(index: number) => {
                    const video = getVideo(index);
                    return (
                        <Vignette
                            video={video}
                            active={selectedVideo.id === video.id}
                            onSelection={setSelectedVideo}
                        />
                    );
                }}
            />
        </Box>
    );
};