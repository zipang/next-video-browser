import { useState } from "react";

type eventHandler = (() => void) | undefined;

export const useDisclosure = (
	initialState = false,
	onOpen?: eventHandler,
	onClose?: eventHandler
) => {
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

	return { isOpen, open, close, toggle };
};
