/**
 * An infinite circular list of constant size that allows easy looping through items.
 */
export class CircularList<T> {
	private _items: T[] = [];
	private _firstItemPos = 0;
	private _length = 0;

	constructor(initial: T[] | number) {
		if (typeof initial === "number") {
			// If a number is passed, create an empty list of that length
			this._length = initial;
			this._items = new Array<T>(initial);
		} else if (Array.isArray(initial)) {
			// If an array is passed, use it as the initial items
			this._items = initial;
			this._length = initial.length;
		} else {
			throw new TypeError("Invalid argument: expected an array or a number");
		}
	}

	get length(): number {
		return this._length;
	}

	/**
	 * Returns the item at the given virtual position
	 *
	 * @param pos The index of the item to return
	 * @returns The item at the given index
	 */
	getItem(pos: number): T {
		let modulo = (this._firstItemPos + pos) % this._length;
		if (modulo < 0) modulo = this._length + modulo;
		return this._items[modulo];
	}
	getFirstItem(): T {
		return this._items[this._firstItemPos];
	}
	getLastItem(): T {
		return this.getItem(-1);
	}

	/**
	 * Create a new VList from the current one by applying a mapping function
	 *
	 * @param mapFn
	 * @returns A new Vlist
	 */
	map<U>(mapFn: (item: T, index: number) => U): CircularList<U> {
		const newItems: U[] = new Array(this._length);
		for (let i = 0; i < this._length; i++) {
			newItems[i] = mapFn(this.getItem(i), i);
		}
		return new CircularList<U>(newItems);
	}

	/**
	 * Find an item in the list based on a predicate function.
	 */
	find(match: (item: T, index: number) => boolean): T | undefined {
		for (let i = 0; i < this._length; i++) {
			const item = this._items[i];
			if (match(item, i)) {
				return item;
			}
		}
		return undefined;
	}

	/**
	 * Call the given function for each item in the list.
	 * @param cb Callback function to call for each item.
	 */
	forEach(cb: (item: T, index: number) => void): void {
		for (let i = 0; i < this._length; i++) {
			cb(this._items[(this._firstItemPos + i) % this._length], i);
		}
	}

	/**
	 * Take the first item and then move it to the end of the list
	 */
	popFirst() {
		if (this._length === 0) return;

		const firstItem = this._items[this._firstItemPos];
		// Advance the pointer to the next item in the circular list
		this._firstItemPos++;
		if (this._firstItemPos >= this._length) {
			this._firstItemPos = 0;
		}
		return firstItem;
	}

	/**
	 * Take the last item and then move it the beginning of the list
	 */
	popLast() {
		if (this._length === 0) return;

		// Move pointer to the previous item (which was the last item in the circular list)
		this._firstItemPos--;
		if (this._firstItemPos < 0) {
			this._firstItemPos = this._length - 1;
		}
		return this._items[this._firstItemPos];
	}

	toString(): string {
		return `VList(length: ${this._length}, first item pos: ${this._firstItemPos})`;
	}
}
