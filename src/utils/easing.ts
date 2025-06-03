/**
 * Easing Functions taken from https://easings.net
 * All functions take a number x in [0, 1] and return a number in [0, 1].
 */

/**
 * All supported easing function names.
 */
export type Easing =
	| "linear"
	| "easeInSine"
	| "easeOutSine"
	| "easeInOutSine"
	| "easeInQuad"
	| "easeOutQuad"
	| "easeInOutQuad"
	| "easeInCubic"
	| "easeOutCubic"
	| "easeInOutCubic"
	| "easeInQuart"
	| "easeOutQuart"
	| "easeInOutQuart"
	| "easeInQuint"
	| "easeOutQuint"
	| "easeInOutQuint"
	| "easeInExpo"
	| "easeOutExpo"
	| "easeInOutExpo"
	| "easeInCirc"
	| "easeOutCirc"
	| "easeInOutCirc"
	| "easeInBack"
	| "easeOutBack"
	| "easeInOutBack"
	| "easeInElastic"
	| "easeOutElastic"
	| "easeInOutElastic"
	| "easeInBounce"
	| "easeOutBounce"
	| "easeInOutBounce";

/**
 * Linear easing function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function linear(x: number): number {
	return x;
}

/**
 * Ease In Sine function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInSine(x: number): number {
	return 1 - Math.cos((x * Math.PI) / 2);
}

/**
 * Ease Out Sine function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeOutSine(x: number): number {
	return Math.sin((x * Math.PI) / 2);
}

/**
 * Ease In Out Sine function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInOutSine(x: number): number {
	return -(Math.cos(Math.PI * x) - 1) / 2;
}

/**
 * Ease In Quad function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInQuad(x: number): number {
	return x * x;
}

/**
 * Ease Out Quad function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeOutQuad(x: number): number {
	return 1 - (1 - x) * (1 - x);
}

/**
 * Ease In Out Quad function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInOutQuad(x: number): number {
	return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
}

/**
 * Ease In Cubic function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInCubic(x: number): number {
	return x * x * x;
}

/**
 * Ease Out Cubic function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeOutCubic(x: number): number {
	return 1 - (1 - x) ** 3;
}

/**
 * Ease In Out Cubic function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInOutCubic(x: number): number {
	return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
}

/**
 * Ease In Quart function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInQuart(x: number): number {
	return x * x * x * x;
}

/**
 * Ease Out Quart function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeOutQuart(x: number): number {
	return 1 - (1 - x) ** 4;
}

/**
 * Ease In Out Quart function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInOutQuart(x: number): number {
	return x < 0.5 ? 8 * x * x * x * x : 1 - (-2 * x + 2) ** 4 / 2;
}

/**
 * Ease In Quint function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInQuint(x: number): number {
	return x * x * x * x * x;
}

/**
 * Ease Out Quint function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeOutQuint(x: number): number {
	return 1 - (1 - x) ** 5;
}

/**
 * Ease In Out Quint function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInOutQuint(x: number): number {
	return x < 0.5 ? 16 * x * x * x * x * x : 1 - (-2 * x + 2) ** 5 / 2;
}

/**
 * Ease In Expo function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInExpo(x: number): number {
	return x === 0 ? 0 : 2 ** (10 * x - 10);
}

/**
 * Ease Out Expo function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeOutExpo(x: number): number {
	return x === 1 ? 1 : 1 - 2 ** (-10 * x);
}

/**
 * Ease In Out Expo function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInOutExpo(x: number): number {
	if (x === 0) return 0;
	if (x === 1) return 1;
	return x < 0.5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2;
}

/**
 * Ease In Circ function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInCirc(x: number): number {
	return 1 - Math.sqrt(1 - x ** 2);
}

/**
 * Ease Out Circ function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeOutCirc(x: number): number {
	return Math.sqrt(1 - (x - 1) ** 2);
}

/**
 * Ease In Out Circ function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInOutCirc(x: number): number {
	return x < 0.5
		? (1 - Math.sqrt(1 - (2 * x) ** 2)) / 2
		: (Math.sqrt(1 - (-2 * x + 2) ** 2) + 1) / 2;
}

/**
 * Ease In Back function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInBack(x: number): number {
	const c1 = 1.70158;
	const c3 = c1 + 1;
	return c3 * x * x * x - c1 * x * x;
}

/**
 * Ease Out Back function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeOutBack(x: number): number {
	const c1 = 1.70158;
	const c3 = c1 + 1;
	return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
}

/**
 * Ease In Out Back function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInOutBack(x: number): number {
	const c1 = 1.70158;
	const c2 = c1 * 1.525;
	return x < 0.5
		? ((2 * x) ** 2 * ((c2 + 1) * 2 * x - c2)) / 2
		: ((2 * x - 2) ** 2 * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

/**
 * Ease In Elastic function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInElastic(x: number): number {
	const c4 = (2 * Math.PI) / 3;
	return x === 0
		? 0
		: x === 1
			? 1
			: -(2 ** (10 * x - 10)) * Math.sin((x * 10 - 10.75) * c4);
}

/**
 * Ease Out Elastic function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeOutElastic(x: number): number {
	const c4 = (2 * Math.PI) / 3;
	return x === 0
		? 0
		: x === 1
			? 1
			: 2 ** (-10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

/**
 * Ease In Out Elastic function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInOutElastic(x: number): number {
	const c5 = (2 * Math.PI) / 4.5;
	if (x === 0) return 0;
	if (x === 1) return 1;
	return x < 0.5
		? -(2 ** (20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
		: (2 ** (-20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}

/**
 * Ease In Bounce function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInBounce(x: number): number {
	return 1 - easeOutBounce(1 - x);
}

/**
 * Ease Out Bounce function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeOutBounce(x: number): number {
	const n1 = 7.5625;
	const d1 = 2.75;
	if (x < 1 / d1) {
		return n1 * x * x;
	}
	if (x < 2 / d1) {
		// biome-ignore lint/style/noParameterAssign: optimization
		return n1 * (x -= 1.5 / d1) * x + 0.75;
	}
	if (x < 2.5 / d1) {
		// biome-ignore lint/style/noParameterAssign: optimization
		return n1 * (x -= 2.25 / d1) * x + 0.9375;
	}
	// biome-ignore lint/style/noParameterAssign: optimization
	return n1 * (x -= 2.625 / d1) * x + 0.984375;
}

/**
 * Ease In Out Bounce function.
 * @param x - Input value in [0, 1]
 * @returns Output value in [0, 1]
 */
export function easeInOutBounce(x: number): number {
	return x < 0.5
		? (1 - easeOutBounce(1 - 2 * x)) / 2
		: (1 + easeOutBounce(2 * x - 1)) / 2;
}
