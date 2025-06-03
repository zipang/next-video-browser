import type { FC } from "react";
import type { IconProps } from ".";
import clsx from "clsx";

export const FullScreenIcon: FC<IconProps> = ({
	size = "1rem",
	color = "currentColor",
	className
}) => {
	return (
		<svg
			className={clsx("fullscreen-icon", className)}
			width={size}
			height={size}
			viewBox="0 0 48 48"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Fullscreen</title>
			<path
				fill={color}
				d="M6.48 11.24V16h3.04V9.52H16V6.48H6.48v4.76M32 8v1.52h6.48V16h3.04V6.48H32V8M6.48 36.76v4.76H16v-3.04H9.52V32H6.48v4.76m32-1.52v3.24H32v3.04h9.52V32h-3.04v3.24"
			/>
		</svg>
	);
};
