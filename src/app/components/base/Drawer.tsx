import { useEffect, type FC, type ReactNode } from "react";
import { useSwipeable, type SwipeableProps } from "react-swipeable";
import { Box, Button, Portal } from "@chakra-ui/react";

import "./drawer-styles.css";

export type DrawerPlacement = "left" | "right";

export interface DrawerStateProps {
	isOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	onToggle: () => void;
	placement?: DrawerPlacement;
}

export interface DrawerProps extends DrawerStateProps {
	children: ReactNode;
	showOverlay?: boolean;
	showHandler?: boolean;
	closeOnEsc?: boolean;
}

const swipeConfig: SwipeableProps = {
	preventScrollOnSwipe: true, // Prevent body scroll when swiping on the drawer
	trackMouse: true, // Optional: enable swipe with mouse for testing on desktop
	delta: 10 // Minimum distance (px) before a swipe starts
	// velocity: 0.3, // Minimum velocity (px/ms)
	// threshold: 50, // Minimum distance (px)
};

/**
 * An invisible border with a centered button that we can use to slide the Drawer open
 */
const SwipeHandler: FC<DrawerStateProps> = ({
	isOpen,
	placement,
	onClose,
	onOpen,
	onToggle
}) => {
	// Configure swipe handlers effect based on placement
	if (placement === "left") {
		swipeConfig.onSwipedRight = onOpen;
		swipeConfig.onSwipedLeft = onClose;
	} else if (placement === "right") {
		swipeConfig.onSwipedRight = onClose;
		swipeConfig.onSwipedLeft = onOpen;
	}

	swipeConfig.onTap = isOpen ? onClose : onOpen;

	const swipeHandlers = useSwipeable(swipeConfig);

	return (
		<Box
			className={`swipe-handler swipe-handler--${placement} ${isOpen ? "swipe-handler--open" : ""}`}
			aria-hidden={!isOpen}
			// Spread swipe handlers

			{...swipeHandlers}
		>
			<Button onClick={onToggle} borderRadius={2} bg="brand.700">
				<span className="swipe-handler--icon">&#10095;</span>
			</Button>
		</Box>
	);
};

// Remove size prop from interface
export const Drawer: FC<DrawerProps> = ({
	isOpen,
	children,
	onClose,
	onOpen,
	onToggle,
	placement = "left",
	showOverlay = true,
	showHandler = true,
	closeOnEsc = true
}) => {
	// Effect for Escape key
	useEffect(() => {
		if (!closeOnEsc) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isOpen) {
				onClose();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose, closeOnEsc]);

	const drawerContentClasses = `drawer-content drawer-content--${placement} ${isOpen ? "drawer-content--open" : ""}`;
	const overlayClasses = `drawer-overlay ${isOpen && showOverlay ? "drawer-overlay--open" : ""}`;

	return (
		<Portal>
			{showOverlay && (
				<Box className={overlayClasses} onClick={onClose} aria-hidden={!isOpen} />
			)}
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
						onClose={onClose}
						onOpen={onOpen}
						onToggle={onToggle}
						placement={placement}
					/>
				)}
			</Box>
		</Portal>
	);
};
