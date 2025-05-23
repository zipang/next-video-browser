import type React from "react";
import type { FC } from "react";
import type { IconProps } from ".";

export const DownloadIcon: FC<IconProps> = ({ size = "1em", color }) => (
	<svg
		width={size}
		height={size}
		fill={color}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 14 14"
		aria-label="Download"
	>
		<title>Download</title>
		<path
			fill="currentColor"
			d="M11.2857,6.05714 L10.08571,4.85714 L7.85714,7.14786 L7.85714,1 L6.14286,1 L6.14286,7.14786 L3.91429,4.85714 L2.71429,6.05714 L7,10.42857 L11.2857,6.05714 Z M1,11.2857 L1,13 L13,13 L13,11.2857 L1,11.2857 Z"
		/>
	</svg>
);
