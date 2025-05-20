import { useState } from "react";

type eventHandler = () => void;
/**
 * toggle the state
 */
type toggleDisclosure = () => void;
/**
 * transition to open
 */
type openDisclosure = () => void;
/**
 * transition to close
 */
type closeDisclosure = () => void;

/**
 * Tuple that allows to easily name each returned elements
 * @example: const [isPanelOpen, togglePanel, openPanel, closePanel] = useDisclosure({ defaultOpen: true })
 */
type UseDisclosureReturn = [
	/**
	 * The current open/close state
	 */
	boolean,
	toggleDisclosure,
	openDisclosure,
	closeDisclosure
];

/**
 * Open/close an UI element and provide means to listen to it
 */
export const useDisclosure = ({
	defaultOpen = false,
	onOpen,
	onClose
}: {
	/**
	 * Should the element be initially visible (TRUE) or hidden (FALSE as default)
	 */
	defaultOpen: boolean;
	/**
	 * Optional callback triggered whenever the element is disclosed
	 */
	onOpen?: eventHandler;
	/**
	 * Optional callback triggered whenever the element is closed
	 */
	onClose?: eventHandler;
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

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
	return [isOpen, toggle, open, close] as UseDisclosureReturn;
};
