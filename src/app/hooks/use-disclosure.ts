import { useState } from "react";

type eventHandler = () => void;

/**
 * Open/close an UI element and provide means to listen to it
 */
export const useDisclosure = ({
	initialState = false,
	onOpen,
	onClose
}: {
	/**
	 * Should the element be initially visible (TRUE) or hidden (FALSE as default)
	 */
	initialState: boolean;
	/**
	 * Optional callback triggered whenever the object is disclosed
	 */
	onOpen?: eventHandler;
	/**
	 * Optional callback triggered whenever the object is closed
	 */
	onClose?: eventHandler;
}) => {
	const [isOpen, setIsOpen] = useState(initialState);

	const open = () => {
		setIsOpen(true);
		if (typeof onOpen === "function") {
			onOpen();
		}
	};

	const close = () => {
		setIsOpen(false);
		if (typeof onClose === "function") {
			onClose();
		}
	};

	const toggle = () => (isOpen ? close() : open());

	// Elements are returned in that order in a tuple so that they can easily be renamed
	return [isOpen, toggle, open, close];
};
