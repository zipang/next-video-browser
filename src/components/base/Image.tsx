import { type FC, type ImgHTMLAttributes } from "react";

interface ImageProps
	extends Omit<ImgHTMLAttributes<HTMLImageElement>, "width" | "height"> {
	src: string;
	alt: string;
	width?: string | number;
	height?: string | number;
	loading?: "eager" | "lazy";
	draggable?: boolean;
}

export const Image: FC<ImageProps> = ({
	src,
	alt,
	width,
	height,
	loading = "lazy",
	draggable = true,
	...props
}) => {
	return (
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			loading={loading}
			draggable={draggable}
			{...props}
		/>
	);
};
