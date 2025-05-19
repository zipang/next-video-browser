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

const SwipeHandler: FC<DrawerStateProps> = ({ isOpen, placement, onToggle, ...rest }) => (
	<Box
		className={`swipe-handler swipe-handler--${placement} ${isOpen ? "swipe-handler--open" : ""}`}
		aria-hidden={!isOpen}
		{...rest}
	>
		<Button onClick={onToggle} borderRadius={2} bg="brand.700">
			<span className="swipe-handler--icon">&#10095;</span>
		</Button>
	</Box>
);

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

	// Configure swipe handlers based on placement
	const swipeConfig: SwipeableProps = {
		preventScrollOnSwipe: true, // Prevent body scroll when swiping on the drawer
		trackMouse: true, // Optional: enable swipe with mouse for testing on desktop
		delta: 10 // Minimum distance (px) before a swipe starts
		// velocity: 0.3, // Minimum velocity (px/ms)
		// threshold: 50, // Minimum distance (px)
	};

	if (placement === "left") {
		swipeConfig.onSwipedRight = onOpen;
		swipeConfig.onSwipedLeft = onClose;
	} else if (placement === "right") {
		swipeConfig.onSwipedRight = onClose;
		swipeConfig.onSwipedLeft = onOpen;
	} else if (placement === "top") {
		swipeConfig.onSwipedDown = onOpen;
		swipeConfig.onSwipedUp = onClose;
	} else if (placement === "bottom") {
		swipeConfig.onSwipedDown = onClose;
		swipeConfig.onSwipedUp = onOpen;
	}

	swipeConfig.onTap = isOpen ? onClose : onOpen;

	const swipeHandlers = useSwipeable(swipeConfig);

	const drawerContentClasses = `drawer-content drawer-content--${placement} ${isOpen ? "drawer-content--open" : ""}`;
	const overlayClasses = `drawer-overlay ${isOpen && showOverlay ? "drawer-overlay--open" : ""}`;

	return (
		<Portal>
			{showOverlay && (
				<Box className={overlayClasses} onClick={onClose} aria-hidden={!isOpen} />
			)}
			<Box
				// Spread swipe handlers onto the Box
				as="aside" // Semantic element for a sidebar/drawer
				className={drawerContentClasses}
				role="dialog"
				aria-modal="true"
				aria-hidden={!isOpen}
				tabIndex={-1} // Makes the drawer focusable, e.g., for Esc key, though handled globally here
			>
				{children}
				{showHandler && (
					<SwipeHandler
						onToggle={onToggle}
						isOpen={isOpen}
						placement={placement}
						{...swipeHandlers}
					/>
				)}
			</Box>
		</Portal>
	);
};
