type Direction = "top" | "bottom" | "left" | "right";
type Vector = [number, number];

interface ListenerOptions {
	/**
	 * Callback for swipe events
	 */
	onSwipe?: (
		direction: Direction,
		vector: Vector,
		duration: number,
		evt: Event
	) => void;
	/**
	 * Callback for drag events
	 * This is called when the user drags their finger on the screen
	 * and the swipe is not completed (i.e. the user has not lifted their finger yet).
	 * @param deplacement Since the last onDrag event, this is the vector of the movement
	 */
	onDrag?: (deplacement: Vector, evt: Event) => void;
	/**
	 * Callback for the last drag event
	 * @param deplacement Since the last onDrag event, this is the vector of the movement
	 * @param speed The speed (in pixels per second) at which the drag was released.
	 */
	onDragEnd?: (deplacement: Vector, speed: number, evt: Event) => void;
	/**
	 * Callback for tap events
	 */
	onTap?: (origin: Vector, evt: Event) => void;
	/**
	 * A specific DOM element to attach the touch event
	 * @default window
	 */
	target?: HTMLElement | Window;
	/**
	 * Register mousedown and mouseup events to track mouse swipes or mouse drags
	 * @default false
	 */
	detectMouseEvents?: boolean;
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
 * Get the vector from point a to point b
 * @returns Vector deplacement
 */
const getDirectionVector = (a: Vector, b: Vector): Vector => [b[0] - a[0], b[1] - a[1]];

/**
 * Main direction of a vector (left, right, top, bottom)
 */
const getMainDirection = ([x, y]: Vector) => {
	if (Math.abs(x) > Math.abs(y)) {
		return x > 0 ? "right" : "left";
	}

	return y > 0 ? "top" : "bottom";
};

/**
 * Detect a touch or swipe event
 * @param opts.onSwipe Callback for swipe events
 */
export class TouchEventListener {
	target: HTMLElement | Window;

	private threshold: number;
	private swapYAxis = false; // Swap Y axis for touch events

	private startTime: number | null = null;
	private endTime: number | null = null;

	private startPos: Vector | null = null;
	private endPos: Vector | null = null;
	private lastPos: Vector | null = null;

	/**
	 * Callbacks
	 */

	private onSwipe:
		| ((dir: Direction, vector: Vector, duration: number, evt: Event) => void)
		| undefined;
	private onDrag: ((deplacement: Vector, evt: Event) => void) | undefined;
	private onDragEnd:
		| ((deplacement: Vector, speed: number, evt: Event) => void)
		| undefined;
	private onTap: ((origin: Vector, evt: Event) => void) | undefined;

	constructor({
		target = window,
		detectMouseEvents = false,
		threshold = 25,
		onSwipe,
		onDrag,
		onDragEnd,
		onTap
	}: ListenerOptions) {
		this.target = target;
		this.threshold = threshold;

		this.onSwipe = onSwipe;
		this.onDrag = onDrag;
		this.onDragEnd = onDragEnd;
		this.onTap = onTap;

		target.addEventListener("touchstart", this.handleTouchStart, { passive: true });
		target.addEventListener("touchend", this.handleTouchEnd, { passive: true });

		// Don't register touchmove if onDrag callback is not defined
		if (this.onDrag) {
			target.addEventListener("touchmove", this.handleTouchMove, { passive: true });
		}

		if (detectMouseEvents) {
			target.addEventListener("mousedown", this.handleMouseDown);
			target.addEventListener("mouseup", this.handleMouseUp);
		}
	}

	cleanup(): void {
		const target = this.target;
		target.removeEventListener("touchstart", this.handleTouchStart);
		target.removeEventListener("touchend", this.handleTouchEnd);
		target.removeEventListener("touchmove", this.handleTouchMove);
		target.removeEventListener("mousedown", this.handleMouseDown);
		target.removeEventListener("mouseup", this.handleMouseUp);
	}

	getTouchPosition(evt: TouchEvent): Vector {
		const touchPoint = evt.changedTouches[0];
		return [touchPoint.clientX, touchPoint.clientY];
	}

	getMousePosition(evt: MouseEvent): Vector {
		return [evt.clientX, evt.clientY];
	}

	reset() {
		this.startTime = null;
		this.endTime = null;
		this.startPos = null;
		this.endPos = null;
		this.lastPos = null;
	}

	handleTouchStart: EventListener = (evt) => {
		this.startTime = Date.now();
		this.startPos = this.getTouchPosition(evt as TouchEvent);
	};

	/**
	 * Same as `handleTouchStart` but for mouse events.
	 * @param evt
	 */
	handleMouseDown: EventListener = (evt) => {
		this.startTime = Date.now();
		this.startPos = this.getMousePosition(evt as MouseEvent);
	};

	handleTouchMove: EventListener = (evt) => {
		this.endTime = Date.now();
		const newPos = this.getTouchPosition(evt as TouchEvent);

		if (!this.lastPos) {
			// If this is the first move, set the last position to the start point
			this.lastPos = this.startPos || newPos;
		}

		// Calculate the deplacement since the last point
		this.onDrag?.(getDirectionVector(this.lastPos, newPos), evt);
		this.lastPos = newPos;
	};

	handleMouseMove: EventListener = (evt) => {
		const newPos = this.getMousePosition(evt as MouseEvent);
		if (!this.lastPos) {
			// If this is the first move, set the last position to the start point
			this.lastPos = this.startPos || newPos;
		}
		// Calculate the deplacement since the last point
		this.onDrag?.(getDirectionVector(this.lastPos, newPos), evt);
		this.lastPos = newPos;
	};

	handleTouchEnd: EventListener = (evt) => {
		const now = Date.now();
		// @ts-expect-error We know the startTime has been registered
		const fullDuration = now - this.startTime;

		this.endPos = this.getTouchPosition(evt as TouchEvent);

		// Signal onDragEnd if a callback is registered
		if (this.onDragEnd && this.lastPos) {
			// Calculate the speed
			const deplacement = getDirectionVector(this.lastPos, this.endPos);
			// @ts-expect-error We know the endTime has been registered
			const releaseSpeed = (norm(deplacement) * 1000) / (now - this.endTime);
			this.onDragEnd(deplacement, releaseSpeed, evt);
		}

		// Signal final deplacement
		if (this.onSwipe && this.startPos && this.endPos) {
			const vector = getDirectionVector(this.startPos, this.endPos);

			if (norm(vector) > this.threshold) {
				const direction = getMainDirection(vector);
				this.onSwipe(direction, vector, fullDuration, evt);
			} else if (this.onTap && fullDuration < 250) {
				this.onTap(this.startPos, evt);
			}
		}

		// Reset the start and end points
		this.reset();
	};

	/**
	 * Same as `handleTouchEnd` but for mouse events.
	 * @param evt
	 */
	handleMouseUp: EventListener = (evt) => {
		this.endTime = Date.now();
		// @ts-expect-error We know the startTime has been registered
		const duration = this.endTime - this.startTime;

		this.endPos = this.getMousePosition(evt as MouseEvent);

		// Signal onDragEnd if a callback is registered
		if (this.onDragEnd && this.lastPos) {
			// Calculate the speed
			const deplacement = getDirectionVector(this.lastPos, this.endPos);
			// @ts-expect-error We know the endTime has been registered
			const releaseSpeed = (norm(deplacement) * 1000) / (now - this.endTime);
			this.onDragEnd(
				getDirectionVector(this.lastPos, this.endPos),
				releaseSpeed,
				evt
			);
		}

		// Signal final deplacement
		if (this.onSwipe && this.startPos && this.endPos) {
			const vector = getDirectionVector(this.startPos, this.endPos);

			if (norm(vector) > this.threshold) {
				const direction = getMainDirection(vector);
				this.onSwipe(direction, vector, duration, evt);
			} else if (this.onTap && duration < 250) {
				this.onTap(this.startPos, evt);
			}
		}

		// Reset the start and end points
		this.reset();
	};
}
