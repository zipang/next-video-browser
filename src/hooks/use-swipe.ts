import { useEffect, useLayoutEffect, useState, type RefObject } from "react";

type Direction = "top" | "bottom" | "left" | "right";
type Vector = [number, number];

interface UseSwipeOptions {
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
 * Direction of a vector
 */
const inferDirection = ([x, y]: Vector) => {
	if (Math.abs(x) > Math.abs(y)) {
		return x > 0 ? "right" : "left";
	}

	return y > 0 ? "top" : "bottom";
};

/**
 * Detect a touch or swipe event
 * @param options pass onSwipe() as the callback that will be called after a swipe event ends..
 */
export const useSwipe = <TouchElement extends HTMLElement>(opts: UseSwipeOptions) => {
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
			evt.preventDefault();
			setStartPoint(evt.touches[0]);
			setEndPoint(null);
		};
		const handleTouchEnd = (evt: TouchEvent) => {
			evt.preventDefault();
			setEndPoint(evt.touches[0]);
			if (stopPropagation) {
				evt.stopPropagation();
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
		elt.addEventListener("touchend", handleTouchEnd);

		if (detectMouseEvents) {
			elt.addEventListener("mousedown", handleMouseDown);
			elt.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			elt.removeEventListener("touchstart", handleTouchStart);
			elt.removeEventListener("touchend", handleTouchEnd);
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
			// The viewport has its Y axis inverted so we redress it so that it points UP
			// @ref https://developer.mozilla.org/en-US/docs/Web/API/Touch/clientY
			const y = startPoint.clientY - endPoint.clientY;

			if (norm([x, y]) > threshold) {
				const dir = inferDirection([x, y]);

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
