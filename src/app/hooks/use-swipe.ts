import { useEffect, useLayoutEffect, useState, type RefObject } from "react";

type Direction = "top" | "bottom" | "left" | "right";
type Vector = [number, number];

interface UseTouchOptions {
	/**
	 * A specific DOM element to attach the touch event
	 * @default window
	 */
	target?: RefObject<TouchElement | null>;
	/**
	 * Register mousedown and mouseup events to track mouse swipes
	 */
	detectMouseEvents?: boolean;
	/**
	 * Stop propagation when a swipe event has been detected
	 */
	stopPropagation?: boolean;
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
 * @param options threshold, callback that will be called after a touch event ends..
 */
export const useSwipe = <TouchElement extends HTMLElement>(opts: UseTouchOptions) => {
	const {
		target,
		detectMouseEvents = false,
		stopPropagation = false,
		threshold = 25,
		onSwipe,
		onTap
	} = opts;
	const [startPoint, setStartPoint] = useState<Touch | MouseEvent | null>(null);
	const [endPoint, setEndPoint] = useState<Touch | MouseEvent | null>(null);

	/*
	 * Register the touch event listeners
	 */
	useLayoutEffect(() => {
		const handleTouchStart = (evt: TouchEvent) => {
			setStartPoint(evt.touches[0]);
			setEndPoint(null);
		};
		const handleTouchMove = (evt: TouchEvent) => {
			setEndPoint(evt.touches[0]);
			if (stopPropagation) {
				evt.stopPropagation();
				evt.preventDefault();
			}
		};
		const handleMouseDown = (evt: MouseEvent) => {
			setStartPoint(evt);
			setEndPoint(null);
		};
		const handleMouseUp = (evt: MouseEvent) => {
			setEndPoint(evt);
		};

		const elt = target ? target.current : window;

		elt.addEventListener("touchstart", handleTouchStart);
		elt.addEventListener("touchmove", handleTouchMove);

		if (detectMouseEvents) {
			elt.addEventListener("mousedown", handleMouseDown);
			elt.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			elt.removeEventListener("touchstart", handleTouchStart);
			elt.removeEventListener("touchmove", handleTouchMove);
			if (detectMouseEvents) {
				elt.removeEventListener("mousedown", handleMouseDown);
				elt.removeEventListener("mouseup", handleMouseUp);
			}
		};
	}, [target, detectMouseEvents, stopPropagation]);

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
