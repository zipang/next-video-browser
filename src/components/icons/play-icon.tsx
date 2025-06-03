import type { FC } from "react";
import type { IconProps } from ".";
import clsx from "clsx";

export const PlayIcon: FC<IconProps> = ({
	size = "1rem",
	color = "currentColor",
	className = ""
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
		fill={color}
		width={size}
		height={size}
		className={clsx("play-icon", className)}
	>
		<title>Play</title>
		<path d="M14 15.06V33a2 2 0 0 0 2.93 1.77l17.09-8.97a2 2 0 0 0 0-3.54L16.93 13.3A2 2 0 0 0 14 15.06z" />
	</svg>
);
