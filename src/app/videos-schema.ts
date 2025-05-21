import * as v from "valibot";
import type { Video } from "@components/PlayerStateProvider";

const exampleDomain = "https://example.com";

/**
 * Validate relatives and absolute URLs
 * Accept URL parameters and hash fragments
 * @param url
 */
const isPathToResource = (url: unknown): boolean => {
	if (typeof url !== "string") {
		throw new Error("Resource URL must be a string");
	}

	// Check if the URL is a valid URL
	const parsedUrl = new URL(url, exampleDomain);

	if (!parsedUrl.protocol.startsWith("http")) {
		throw new Error("Invalid URL protocol");
	}

	return true;
};

/**
 * Schema for resources in each video
 */
const resourceSchema = v.object({
	name: v.string(),
	url: v.pipe(v.custom(isPathToResource))
});

/**
 * Schema for a single video entry
 */
const videoSchema = v.object({
	id: v.number(),
	title: v.string(),
	duration: v.string(),
	description: v.string(),
	thumbnail: v.string(),
	src: v.pipe(v.string(), v.url()),
	resources: v.array(resourceSchema)
});

/**
 * Schema for the videos.json array
 */
export const videosSchema = v.array(videoSchema);

/**
 * Validate and convert to Video[]
 */
export const validateVideos = (data: unknown): Video[] => {
	try {
		// Validate the data against the schema
		return v.parse(videosSchema, data) as Video[];
	} catch (err) {
		// Handle the error
		console.error("Videos schema validation error:", err);
		throw err;
	}
};
