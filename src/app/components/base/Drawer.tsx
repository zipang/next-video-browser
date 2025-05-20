import {
	useEffect,
	useRef,
	type FC,
	type MouseEventHandler,
	type ReactNode
} from "react";
import { Box, Button, Center, Portal } from "@chakra-ui/react";

import "./drawer-styles.css";
import { useSwipe } from "@hooks/use-swipe";

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
const SwipeHandler: FC<DrawerStateProps> = ({
	isOpen,
	placement,
	close,
	open,
	toggle
}) => {
	const handleToggle: MouseEventHandler = (evt) => {
		evt.preventDefault();
		toggle();
	};

	return (
		<Center
			className={`swipe-handler swipe-handler--${placement} ${isOpen ? "swipe-handler--open" : ""}`}
			aria-hidden={!isOpen}
			// Spread swipe handlers
		>
			<Button onClick={handleToggle} borderRadius={2} bg="brand.700">
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
	// Listen to swipe event on the overlaty layer
	useSwipe({
		detectMouseEvents: false,
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

	const drawerContentClasses = `drawer-content drawer-content--${placement} ${isOpen ? "drawer-content--open" : ""}`;
	const overlayClasses = `drawer-overlay ${isOpen && showOverlay ? "drawer-overlay--open" : ""}`;

	const handleClose: MouseEventHandler = (evt) => {
		evt.preventDefault();
		close();
	};

	return (
		<Portal>
			{showOverlay && <Box className={overlayClasses} onClick={handleClose} />}
			<Box
				as="aside" // Semantic element for a sidebar/drawer
				className={drawerContentClasses}
				aria-hidden={!isOpen}
				tabIndex={-1} // Makes the drawer focusable, e.g., for Esc key, though handled globally here
			>
				{children}
				{showHandler && (
					<SwipeHandler
						isOpen={isOpen}
						close={close}
						open={open}
						toggle={toggle}
						placement={placement}
					/>
				)}
			</Box>
		</Portal>
	);
};
