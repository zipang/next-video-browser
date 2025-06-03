import { TouchEventListener } from "@utils/TouchEventsListener";
import { easeOutBack } from "@utils/easing";
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
	 * Index of the selected slide
	 */
	selected: number;
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
	selected = -1; // no default selected slide
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
		count,
		selected
	}: VSliderOptions) {
		this.getSlide = getSlide;
		this.onSlideSelect = onSlideSelect || (() => "active");
		this.count = count;
		this.selected = selected;

		this.damping = damping;

		// We need to add another layer to capture the mouse wheel and touch events
		this.touchLayer = document.createElement("div");
		this.touchLayer.className = "vertical-slider__touch-layer";
		this.touchLayer.style.width = `${width}px`;

		this.touchLayer.addEventListener(
			"wheel",
			(event) => {
				this.animate(-event.deltaY * 11);
			},
			{ passive: true }
		);

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
				this.onSlideSelect(index);
				this.activateSlide(index);
			}
		});

		/**
		 * Listen to the ENTER key to select the slide under the cursor
		 */
		this.touchLayer.addEventListener("keydown", (evt) => {
			console.log(`KEY PRESSED ${evt.key}`);
			if (evt.key === "Enter") {
				// Find the slide with the focus
				const selectedSlide = this.slides.find(
					({ element }) => element === document.activeElement
				);
				console.log(
					"Found slide with focus",
					selectedSlide,
					document.activeElement
				);
				const index = selectedSlide?.getData("index");
				if (this.onSlideSelect && index !== undefined) {
					this.onSlideSelect(index);
					this.activateSlide(index);
				}
			}
		});

		new TouchEventListener({
			target: this.touchLayer,

			onDrag: ([_, movY], evt) => {
				evt.preventDefault();
				evt.stopPropagation();
				// Translate the slider with the movement vector
				requestAnimationFrame(() => {
					this.sliderOffset += movY;
					this.slider.style.transform = `translateY(${this.sliderOffset}px)`;
					this.updateSlidesPosition(movY);
				});
			},
			onDragEnd: ([_, movY], speed, evt) => {
				evt.preventDefault();
				evt.stopPropagation();

				if (speed > 10) {
					// If the movement is significant, animate the slider
					this.animate(movY * speed);
				} else {
					this.stop();
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

		this.slides = new CircularList(repeat * count).map((_, i) => {
			const index = i % count;
			// Each slide is wrapped inside an absolutely positionned div (slide-container)
			const slideWrapper = new ElementWrapper({
				element: "div.slide-container",
				mode: "create",
				data: { index }
			});

			const { height, render } = getSlide(index);
			slideWrapper.height = height;
			slideWrapper.top = slidePos;
			slidePos = slidePos + height;
			slideWrapper.swapChild(render);
			if (index === this.selected) slideWrapper.classList.add("active");

			return slideWrapper.appendTo(this.slider);
		});

		console.log(`VerticalSlider initialized with ${repeat}x${count} slides`);
	}

	/**
	 * Translate the slider up or down with the given initial velocity
	 * Velocity decrease over time with the damping factor.
	 * @param initialVelocity The initial velocity in pixels per second.
	 * @param applyDamping Apply a natural velocity decrease. Pass FALSE to control the speed
	 */
	animate(initialVelocity: number, applyDamping = true) {
		this.velocity = initialVelocity;

		if (this.isAnimating) {
			return;
		}

		let lastTimestanp = Date.now();

		this.isAnimating = true;

		const animationLoop = () => {
			// We have been interrupted
			if (!this.isAnimating) return this.stop();

			const now = Date.now();
			const deltaTime = now - lastTimestanp;
			lastTimestanp = now;

			// Update the vertical position of the slider
			let velocity = this.velocity;
			this.sliderOffset += Math.round((velocity / 1000) * deltaTime);
			this.slider.style.transform = `translateY(${this.sliderOffset}px)`;

			this.updateSlidesPosition(velocity);

			// Update the velocity (apply the damping factor)
			if (applyDamping) velocity = velocity * this.damping;

			if (Math.abs(velocity) < 0.05) {
				// Velocity is now too low, stop the animation
				return this.stop();
			}
			// If the velocity is still high enough, continue the animation
			this.velocity = velocity;
			requestAnimationFrame(animationLoop);
		};

		requestAnimationFrame(animationLoop);
	}

	updateSlidesPosition(lastMoveY: number) {
		// Now we want to reposition the slides that went out of view
		const slides = this.slides;

		if (lastMoveY > 0) {
			// If we are moving down, we want to recycle the last slide under the viewport
			// and put it in first position above the viewport
			const lastSlide = slides.getLastItem();

			if (lastSlide.top + this.sliderOffset > this.viewportHeight + 100) {
				// Move the last slide before the first slide
				const firstSlide = slides.getFirstItem();
				lastSlide.top = firstSlide.top - lastSlide.height;
				slides.popLast();
			}
		} else {
			// If we are moving up, we want to recycle the slides that are above the viewport
			// and put them in last position under the viewport
			const firstSlide = slides.getFirstItem();

			if (firstSlide.top + this.sliderOffset < -1.1 * firstSlide.height) {
				// Move the first slide after the last slide
				const lastSlide = slides.getLastItem();
				firstSlide.top = lastSlide.top + lastSlide.height;
				slides.popFirst();
			}
		}
	}

	activateSlide(index: number) {
		console.log(`Activating slide #${index}`);
		this.selected = index;
		// Remove the active class from all slides
		this.slides.forEach((slide) => {
			slide.element.classList.remove("active");
			// Add the active class to the selected slides with the same index
			if (slide.getData("index") === index) {
				slide.element?.classList.add("active");
			}
		});
		return this;
	}

	/**
	 * Scroll a slide to the center of the viewport
	 * @param index of the slide to select
	 * @param time scroll duration in ms
	 */
	scrollToSlide(index: number, time: number) {
		const { top, height } = this.slides.getItem(index);
		const initialOffset = this.sliderOffset;
		const targetOffset = initialOffset - top + window.innerHeight / 2 - height / 2;
		const velocity = (targetOffset / time) * 1000;
		const start = Date.now();

		console.log(
			`Scolling to slide #${index} will move the slider from ${initialOffset} to ${targetOffset}px in ${time}ms. Velocity is ${velocity}px/s`
		);

		const animationLoop = () => {
			if (!this.isAnimating) return this.stop();

			const progression = (Date.now() - start) / time;

			const newOffset = Math.round(
				initialOffset + targetOffset * easeOutBack(progression)
			);

			if (newOffset !== this.sliderOffset) {
				this.sliderOffset = newOffset;
				this.slider.style.transform = `translateY(${newOffset}px)`;

				this.updateSlidesPosition(velocity);
			}

			if (progression < 1) {
				requestAnimationFrame(animationLoop);
			} else {
				this.stop();
			}
		};

		this.isAnimating = true;
		requestAnimationFrame(animationLoop);
	}

	stop() {
		this.isAnimating = false;
		this.velocity = 0;

		this.slides.forEach((slide, index) => {
			slide.tabIndex = index + 1;
		});
		return this;
	}
}
