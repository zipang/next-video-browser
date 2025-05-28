/**
 * Utility function for quickly creating HTML elements
 * from a string representation similar to a CSS selector.
 * The string format is: `tagName#id.class1.class2`
 */
function createElement(tagExp: string): HTMLElement {
	try {
		const [tagNameAndId, ...classNames] = tagExp.split(".");
		const [tagName, id] = tagNameAndId.split("#");
		const element = document.createElement(tagName);
		if (id) {
			element.id = id;
		}
		element.classList.add(...classNames);
		return element;
	} catch (err) {
		throw new TypeError(
			`Invalid tag expression: '${tagExp}' (${(err as Error).message}). Expected format: tagName#id.class1.class2`
		);
	}
}

interface ElementWrapperOptions {
	element: string | HTMLElement;
	mode?: "create" | "select";
	data?: Record<string, any>;
}

/**
 * ElementWrapper is a class that wraps an HTMLElement and provides
 * convenient getters and setters for its style properties.
 * It allows you to easily manipulate the top, left, width, and height
 * of the element using pixel values.
 */
export class ElementWrapper {
	// @ts-expect-error element is initialized in the constructor or an exception is thrown
	private element: HTMLElement;

	// Store any additional data associated with the element
	private data: Record<string, any> = {};

	/**
	 * Create a new ElementWrapper instance.
	 * You can either create a new element from a string representation
	 * or select an existing element from the DOM.
	 * @param element A CSS selector representing the element to create or select, or an existing HTMLElement.
	 * @param mode
	 */
	constructor({ element, mode = "select", data = {} }: ElementWrapperOptions) {
		if (typeof element === "string") {
			if (mode === "create") {
				// If the mode is "create", create a new element from the string
				this.element = createElement(element);
			} else if (mode === "select") {
				// If the mode is "select", find an existing element by selector
				const el = document.querySelector<HTMLElement>(element);
				if (!el) {
					throw new TypeError(`Element not found: ${element}`);
				}
				this.element = el;
			}
		} else if (element instanceof HTMLElement) {
			this.element = element;
		} else {
			throw new TypeError("Expected a string selector or an HTMLElement");
		}
		this.data = data;
	}

	get top(): number {
		return Number.parseInt(this.element.style.top, 10);
	}
	set top(value: number) {
		this.element.style.top = `${value}px`;
	}
	get left(): number {
		return Number.parseInt(this.element.style.left, 10);
	}
	set left(value: number) {
		this.element.style.left = `${value}px`;
	}

	get width(): number {
		return Number.parseInt(this.element.style.width, 10);
	}
	set width(value: number) {
		this.element.style.width = `${value}px`;
	}
	get height(): number {
		return Number.parseInt(this.element.style.height, 10);
	}
	set height(value: number) {
		this.element.style.height = `${value}px`;
	}

	get className(): string {
		return this.element.className;
	}
	set className(value: string) {
		this.element.className = value;
	}
	get classList(): DOMTokenList {
		return this.element.classList;
	}

	setData(key: string, value: any): void {
		this.data[key] = value;
	}
	getData(key: string): any {
		return this.data[key];
	}

	/**
	 * Add our element inside the DOM tree
	 * @returns The ElementWrapper instance for chaining
	 */
	appendTo(parent: HTMLElement): ElementWrapper {
		parent.appendChild(this.element);
		return this;
	}

	/**
	 * Replace the existing child with a new one and return the old child.
	 */
	swapChild(update: HTMLElement | ((parent: HTMLElement) => void)): HTMLElement {
		const oldChild = this.element.childNodes[0];

		if (update instanceof HTMLElement) {
			// If newChild is already an HTMLElement, we can directly replace it
			this.element.replaceChild(update, oldChild);
		} else if (typeof update === "function") {
			// If newChild is a function, we call it with the parent element
			update(this.element);
		} else {
			throw new TypeError("newChild must be an HTMLElement or a render function");
		}
		// Return the old child
		return oldChild as HTMLElement;
	}
}
