import { useEffect, useState, type RefObject } from "react";

type Direction = "top" | "bottom" | "left" | "right";
type Vector = [number, number];

interface UseTouchOptions {
	/**
	 * A specific element on which register the touch event
	 * @default window
	 */
	ref?: RefObject<TouchElement | null>;
	/**
	 * Register mousedown and mouseup events to track mouse swipes
	 */
	detectMouseEvents?: boolean;
	/**
	 * Number of pixel before the event is considered a swipe
	 * (under that number it's a 'tap')
	 * @default 25px
	 */
	threshold?: number;
	onSwipe: (direction: Direction, vector: Vector) => void;
	onTap?: (origin: Touch) => void;
}

/**
 * Norm (length) of a vector
 */
const norm = (v: Vector) => Math.sqrt(v[0] ** 2 + v[1] ** 2);

/**
 * Detect a touch or swipe event
 * @ref https://developer.mozilla.org/en-US/docs/Web/API/Touch/clientY
 * @param ref a reference on the element that will record the events
 * @param options threshold, callback that will be called after a touch event ends..
 */
export const useSwipe = <TouchElement extends HTMLElement>({
	ref,
	detectMouseEvents = false,
	threshold = 25,
	onSwipe,
	onTap
}: UseTouchOptions) => {
	const [startPoint, setStartPoint] = useState<Touch | MouseEvent | null>(null);
	const [endPoint, setEndPoint] = useState<Touch | MouseEvent | null>(null);

	/* Register the touch event listeners */
	useEffect(() => {
		const handleTouchStart = (evt: TouchEvent) => {
			setStartPoint(evt.touches[0]);
			setEndPoint(null);
		};
		const handleTouchMove = (evt: TouchEvent) => {
			setEndPoint(evt.touches[0]);
		};
		const handleMouseDown = (evt: MouseEvent) => {
			console.log("start dragging");
			setStartPoint(evt);
			setEndPoint(null);
		};
		const handleMouseUp = (evt: MouseEvent) => {
			console.log("end dragging");
			setEndPoint(evt);
		};

		const target = ref?.current ?? window;

		target.addEventListener("touchstart", handleTouchStart);
		target.addEventListener("touchmove", handleTouchMove);

		if (detectMouseEvents) {
			target.addEventListener("mousedown", handleMouseDown);
			target.addEventListener("mouseup", handleMouseUp);
			console.log("Registered mouse events");
		}

		return () => {
			target.removeEventListener("touchstart", handleTouchStart);
			target.removeEventListener("touchmove", handleTouchMove);
			if (detectMouseEvents) {
				target.removeEventListener("mousedown", handleMouseDown);
				target.removeEventListener("mouseup", handleMouseUp);
				console.log("Removed mouse events");
			}
		};
	}, [ref]);

	/* Register a touch or swipe event */
	useEffect(() => {
		if (startPoint && endPoint) {
			// Mesure our vector
			const x = endPoint.clientX - startPoint.clientX;
			// The viewport has its y axis inverted so we redress it
			const y = startPoint.clientY - endPoint.clientY;

			let dir: Direction;
			if (Math.abs(x) > Math.abs(y)) {
				if (x > 0) {
					dir = "right";
				} else {
					dir = "left";
				}
			} else {
				if (y > 0) {
					dir = "top";
				} else {
					dir = "bottom";
				}
			}

			if (norm([x, y]) > threshold) {
				console.log(`Swipe ${dir} (${x}, ${y})`);
				onSwipe(dir, [x, y]);
			} else if (onTap && (startPoint as Touch).radiusX) {
				onTap(startPoint as Touch);
			}
			setStartPoint(null);
			setEndPoint(null);
		}
	}, [startPoint, endPoint, onSwipe, onTap, threshold]);
};
