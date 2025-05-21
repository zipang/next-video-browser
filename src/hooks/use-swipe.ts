import { useEffect, useLayoutEffect, useState, type RefObject } from "react";

type Direction = "top" | "bottom" | "left" | "right";
type Vector = [number, number];

interface UseSwipeOptions {
	/**
	 * Callback for swipe events
	 */
	onSwipe: (direction: Direction, vector: Vector) => void;
	/**
	 * Callback for tap events
	 */
	onTap?: (origin: Touch) => void;
	/**
	 * A specific DOM element to attach the touch event
	 * @default window
	 */
	target?: RefObject<HTMLElement | null>;
	/**
	 * Register mousedown and mouseup events to track mouse swipes
	 */
	detectMouseEvents?: boolean;
	/**
	 * Prevent default (will prevent a click event to occur)
	 * @default false
	 */
	preventDefault?: boolean;
	/**
	 * Stop propagation to further layers
	 */
	stopPropagation?: boolean;
	/**
	 * Number of pixel before the event is considered a swipe
	 * (under that number it's a 'tap')
	 * @default 25px
	 */
	threshold?: number;
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
 * @param opts.onSwipe Callback for swipe events
 */
export const useSwipe = ({
	target,
	detectMouseEvents = false,
	preventDefault = false,
	stopPropagation = false,
	threshold = 25,
	onSwipe,
	onTap
}: UseSwipeOptions) => {
	const [startPoint, setStartPoint] = useState<Touch | MouseEvent | null>(null);
	const [endPoint, setEndPoint] = useState<Touch | MouseEvent | null>(null);

	/*
	 * Register the touch event listeners
	 */
	useLayoutEffect(() => {
		const handleTouchStart = (evt: TouchEvent) => {
			setStartPoint(evt.touches[0]);
			setEndPoint(null);
			if (preventDefault) evt.preventDefault();
		};
		const handleTouchEnd = (evt: TouchEvent) => {
			setEndPoint(evt.changedTouches[0] || evt.touches[0]);
			if (preventDefault) evt.preventDefault();
			if (stopPropagation) evt.stopPropagation();
		};
		const handleMouseDown = (evt: MouseEvent) => {
			setStartPoint(evt);
			setEndPoint(null);
		};
		const handleMouseUp = (evt: MouseEvent) => {
			setEndPoint(evt);
		};

		const elt = target ? target.current : window;
		if (!elt) return;

		elt.addEventListener("touchstart", handleTouchStart as EventListener);
		elt.addEventListener("touchend", handleTouchEnd as EventListener);

		if (detectMouseEvents) {
			elt.addEventListener("mousedown", handleMouseDown as EventListener);
			elt.addEventListener("mouseup", handleMouseUp as EventListener);
		}

		return () => {
			elt.removeEventListener("touchstart", handleTouchStart as EventListener);
			elt.removeEventListener("touchend", handleTouchEnd as EventListener);
			if (detectMouseEvents) {
				elt.removeEventListener("mousedown", handleMouseDown as EventListener);
				elt.removeEventListener("mouseup", handleMouseUp as EventListener);
			}
		};
	}, [target, detectMouseEvents, preventDefault, stopPropagation]);

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
