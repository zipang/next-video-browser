import { useLayoutEffect } from "react";

type OnKeyPressedCallback = (event: KeyboardEvent) => void;

const eventListeners: Map<string, OnKeyPressedCallback[]> = new Map();

const globalKeyListener: OnKeyPressedCallback = (evt) => {
	// Apply the listeners
	eventListeners.get(evt.code)?.forEach((cb) => cb(evt));
};

const useKeypress = (code: string, handler: OnKeyPressedCallback) => {
	useLayoutEffect(() => {
		if (eventListeners.size === 0) {
			window.addEventListener("keyup", globalKeyListener);
		}

		if (!eventListeners.has(code)) {
			eventListeners.set(code, []);
		}
		eventListeners.get(code)?.push(handler);

		return function cleanup() {
			const keyHandlers = eventListeners.get(code);
			if (keyHandlers) {
				eventListeners.set(
					code,
					keyHandlers.filter((hnd) => hnd !== handler)
				);
				if (keyHandlers.length === 0) {
					eventListeners.delete(code);
					if (eventListeners.size === 0) {
						window.removeEventListener("keyup", globalKeyListener);
					}
				}
			}
		};
	}, [code, handler]);
};

export default useKeypress;
