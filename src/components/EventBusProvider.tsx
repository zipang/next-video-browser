"use client";

import { createContext, type FC, type PropsWithChildren } from "react";

type TCallback = () => void;
type TListener = (data: any) => void;

class EventBus {
	private _listeners: Record<string, TListener[]>;

	constructor() {
		this._listeners = {};
	}

	on(event: string, callback: TCallback) {
		if (!this._listeners[event]) {
			this._listeners[event] = [];
		}
		this._listeners[event].push(callback);
	}

	off(event: string, callback: TCallback) {
		if (this._listeners[event]) {
			this._listeners[event] = this._listeners[event].filter(
				(listener) => listener !== callback
			);
		}
	}

	emit(event: string, data: any) {
		const listeners = this._listeners[event];
		if (!listeners) {
			return;
		}
		/* Use for loop for performance */
		for (let i = 0; i < listeners.length; i++) {
			listeners[i](data);
		}
	}
}

const eventBus = new EventBus();

/**
 * EventBusProvider is a React context provider that allows components to subscribe to and emit events.
 * It uses a singleton instance of EventBus to manage the events.
 */
const EventBusContext = createContext<EventBus | null>(null);

export const EventBusProvider: FC<PropsWithChildren> = ({ children }) => {
	return (
		<EventBusContext.Provider value={eventBus}>{children}</EventBusContext.Provider>
	);
};
import { useContext } from "react";

export const useEventBus: () => EventBus = () => {
	const context = useContext(EventBusContext);
	if (!context) {
		throw new Error("useEventBus() must be used within an EventBusProvider");
	}
	return context;
};
