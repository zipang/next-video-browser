import type { FC } from "react";
import type { IconProps } from ".";
import clsx from "clsx";

export const DownloadIcon: FC<IconProps> = ({
	size = "1rem",
	color = "currentColor",
	className
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 14 14"
		fill={color}
		width={size}
		height={size}
		className={clsx("download-icon", className)}
	>
		<title>Download</title>
		<path d="M11.2857,6.05714 L10.08571,4.85714 L7.85714,7.14786 L7.85714,1 L6.14286,1 L6.14286,7.14786 L3.91429,4.85714 L2.71429,6.05714 L7,10.42857 L11.2857,6.05714 Z M1,11.2857 L1,13 L13,13 L13,11.2857 L1,11.2857 Z" />
	</svg>
);
