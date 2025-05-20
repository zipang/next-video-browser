import {
	useEffect,
	useRef,
	type FC,
	type MouseEventHandler,
	type ReactNode
} from "react";
import { Box, Button, Center, Portal } from "@chakra-ui/react";
import clsx from "clsx";
import { useSwipe } from "@hooks/use-swipe";

import "./drawer-styles.css";

export type DrawerPlacement = "left" | "right";

export interface DrawerStateProps {
	isOpen: boolean;
	close: () => void;
	open: () => void;
	toggle: () => void;
	placement?: DrawerPlacement;
}

export interface DrawerProps extends DrawerStateProps {
	children: ReactNode;
	showOverlay?: boolean;
	showHandler?: boolean;
	closeOnEsc?: boolean;
}

/**
 * An invisible border with a centered button that we can use to slide the Drawer open
 */
const SwipeHandler: FC<DrawerStateProps> = ({ isOpen, placement, toggle }) => {
	const handleToggle: MouseEventHandler = (evt) => {
		evt.preventDefault();
		toggle();
	};

	return (
		<Center
			className={`swipe-handler swipe-handler--${placement} ${isOpen ? "swipe-handler--open" : ""}`}
			onClick={handleToggle}
		>
			<Button borderRadius={2} bg="brand.700">
				<span className="swipe-handler--icon">&#10095;</span>
			</Button>
		</Center>
	);
};

// Remove size prop from interface
export const Drawer: FC<DrawerProps> = ({
	isOpen,
	children,
	close,
	open,
	toggle,
	placement = "left",
	showOverlay = true,
	showHandler = true,
	closeOnEsc = true
}) => {
	// Listen to swipe event
	useSwipe({
		stopPropagation: true,
		onSwipe: (swipeDirection) => {
			if (swipeDirection === "top" || swipeDirection === "bottom") {
				return;
			}
			if (placement === "left") {
				return swipeDirection === "right" ? open() : close();
			}
			if (placement === "right") {
				return swipeDirection === "left" ? open() : close();
			}
		}
	});

	// Effect for Escape key
	useEffect(() => {
		if (!closeOnEsc) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isOpen) {
				close();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, close, closeOnEsc]);

	const handleOverlayClick: MouseEventHandler = (evt) => {
		evt.preventDefault();
		evt.stopPropagation();
		close();
	};

	return (
		<Portal>
			{showOverlay && (
				<Box
					className={clsx("drawer-overlay", isOpen && "drawer-overlay--open")}
					onClick={handleOverlayClick}
				/>
			)}
			<Box
				as="aside"
				className={clsx("drawer-content", placement, isOpen && "open")}
				aria-hidden={!isOpen}
				tabIndex={-1} // Makes the drawer focusable, e.g., for ENTER
			>
				{children}
				{showHandler && (
					<SwipeHandler isOpen={isOpen} toggle={toggle} placement={placement} />
				)}
			</Box>
		</Portal>
	);
};
