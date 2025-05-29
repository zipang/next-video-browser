import { CircularList } from "./CircularList";
import { ElementWrapper } from "./ElementWrapper";

import "./vertical-slider.css";

export interface Slide {
	width: number;
	height: number;
	render: (parent: HTMLElement) => void;
}

export interface VSliderOptions {
	target: HTMLDivElement;
	/**
	 * Function to render the slide
	 */
	getSlide: (index: number) => Slide;
	/**
	 * Number of slides
	 */
	count: number;
	/**
	 * Width of the slider
	 */
	width: number;
	/**
	 * Damping factor for the slider
	 * This is used to slow down the slider
	 * @default 0.9
	 */
	damping?: number;
	/**
	 * Callback on slide selection
	 * @returns a string that will be used as the selected class name
	 */
	onSlideSelect?: (index: number) => string;
}

export class VerticalSlider {
	getSlide: (index: number) => Slide;
	count: number;

	isAnimating = false; // start/stop the animation
	velocity = 0; // animation speed (px/s)
	damping: number;

	slides: CircularList<ElementWrapper>;
	slider: HTMLDivElement;
	sliderOffset = 0; // Initial offset
	touchLayer: HTMLDivElement;
	viewportHeight: number;
	onSlideSelect: (index: number) => string;

	// Store the options
	constructor({
		target,
		getSlide,
		onSlideSelect,
		width = 240,
		damping = 0.9,
		count
	}: VSliderOptions) {
		this.getSlide = getSlide;
		this.onSlideSelect = onSlideSelect || (() => "active");
		this.count = count;

		this.damping = damping;

		// We need to add another layer to capture the mouse wheel and touch events
		this.touchLayer = document.createElement("div");
		this.touchLayer.className = "vertical-slider__touch-layer";
		this.touchLayer.style.width = `${width}px`;

		this.touchLayer.addEventListener("wheel", (event) => {
			event.preventDefault();
			this.animate(-event.deltaY * 11);
		});

		this.touchLayer.addEventListener("click", (event) => {
			// Stop the animation if it is running
			this.stop();
			// Find the closest slide element to the clicked target
			const targetElement = event.target as HTMLElement;
			const slideElement = targetElement.closest(".slide-container");
			const selectedSlide = this.slides.find(
				({ element }) => element === slideElement
			);
			const index = selectedSlide?.getData("index");

			if (this.onSlideSelect && index !== undefined) {
				const className = this.onSlideSelect(index);
				if (className) {
					// Remove the active class from all slides
					this.slides.forEach((slide) => {
						slide.element.classList.remove(className);
						// Add the active class to the selected slides with the same index
						if (slide.getData("index") === index) {
							slide.element?.classList.add(className);
						}
					});
				}
			}
		});
		target.appendChild(this.touchLayer);

		this.slider = document.createElement("div");
		// This className brings most of the CSS styles
		this.slider.className = "vertical-slider";
		this.slider.style.width = `${width}px`;
		this.touchLayer.appendChild(this.slider);

		// Reserve a fixed array for the slides that is enough to fill the viewport
		this.viewportHeight = window.screen.height;
		const slideHeight = getSlide(0).height;
		let slidePos = -2 * slideHeight;

		// Determine how much slide wrappers we need to cover the viewport
		const heights = [...Array(count).keys()].map((_, idx) => getSlide(idx).height);
		console.log("Slides heights", heights);
		const totalHeight = heights.reduce((prev, h) => prev + h, 0);
		console.log(
			`Total height of all slides: ${totalHeight}px VS screen height: ${this.viewportHeight}px`
		);
		// We will repeat the slides until we can cover the viewport + 100px on each side
		let repeat = 1;
		while (repeat * totalHeight < this.viewportHeight + 200) repeat++;

		this.slides = new CircularList(repeat * count).map((_, index) => {
			// Each slide is wrapped inside an absolutely positionned div (slide-container)
			const slideWrapper = new ElementWrapper({
				element: "div.slide-container",
				mode: "create",
				data: { index }
			});

			const { height, render } = getSlide(index % count);
			slideWrapper.height = height;
			slideWrapper.top = slidePos;
			slidePos = slidePos + height;
			slideWrapper.swapChild(render);
			slideWrapper.setData("index", index % count);

			return slideWrapper.appendTo(this.slider);
		});

		console.log(`VerticalSlider initialized with ${repeat}x${count} slides`);
	}

	/**
	 * Translate the slider up or down with the given initial velocity
	 * Velocity decrease over time with the damping factor.
	 * @param initialVelocity The initial velocity in pixels per second.
	 */
	animate(initialVelocity: number) {
		this.velocity = initialVelocity;

		if (this.isAnimating) {
			return;
		}

		let lastTimestanp = Date.now();
		let sliderOffset = this.sliderOffset;

		this.isAnimating = true;

		const onAnimationEnd = () => {
			this.isAnimating = false;
			this.velocity = 0;
			console.log(
				`Animation ended. Initial offset: ${this.sliderOffset}, final offset: ${sliderOffset}`
			);
			return (this.sliderOffset = sliderOffset); // Update the offset to the current position
		};

		const animationLoop = () => {
			// We have been interrupted
			if (!this.isAnimating) return onAnimationEnd();

			const now = Date.now();
			const deltaTime = now - lastTimestanp;
			lastTimestanp = now;

			// Update the vertical position of the slider
			let velocity = this.velocity;
			sliderOffset += Math.round((velocity / 1000) * deltaTime);
			this.slider.style.transform = `translateY(${sliderOffset}px)`;

			// Now we want to move the slides that get out of view
			const slides = this.slides;

			if (velocity > 0) {
				// If we are moving down, we want to recycle the last slide under the viewport
				// and put it in first position above the viewport
				const lastSlide = slides.getLastItem();

				if (lastSlide.top + sliderOffset > this.viewportHeight + 100) {
					// Move the last slide before the first slide
					const firstSlide = slides.getFirstItem();
					lastSlide.top = firstSlide.top - lastSlide.height;
					slides.popLast();
				}
			} else {
				// If we are moving up, we want to recycle the slides that are above the viewport
				// and put them in last position under the viewport
				const firstSlide = slides.getFirstItem();

				if (firstSlide.top + sliderOffset < -1.1 * firstSlide.height) {
					// Move the first slide after the last slide
					const lastSlide = slides.getLastItem();
					firstSlide.top = lastSlide.top + lastSlide.height;
					slides.popFirst();
				}
			}

			// Update the velocity (apply the damping factor)
			velocity = velocity * this.damping;

			if (Math.abs(velocity) < 0.05) {
				// Velocity is now too low, stop the animation
				return onAnimationEnd();
			}
			// If the velocity is still high enough, continue the animation
			this.velocity = velocity;
			requestAnimationFrame(animationLoop);
		};

		requestAnimationFrame(animationLoop);
	}

	stop() {
		this.isAnimating = false;
		this.velocity = 0;
	}
}
