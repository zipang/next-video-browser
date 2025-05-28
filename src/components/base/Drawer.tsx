import { useRef, type FC, type MouseEventHandler, type ReactNode } from "react";
import { Box, Button, Center, useSafeLayoutEffect } from "@chakra-ui/react";
import clsx from "clsx";
import {
	type AnimatableObject,
	type Scope,
	createAnimatable,
	createDraggable,
	createScope
} from "animejs";

import "./drawer-styles.css";

export type DrawerPlacement = "left" | "right";
const drawerPositions = {
	left: {
		open: 0,
		close: -240
	},
	right: {
		open: 240,
		close: 0
	}
};

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
	const refHandler = useRef<HTMLDivElement | null>(null);

	const handleToggle: MouseEventHandler = (evt) => {
		evt.preventDefault();
		evt.stopPropagation();
		console.log("SwipeHandler clicked to toggle drawer");
		if (refHandler.current?.classList.contains("dragging")) {
			return;
		}
		toggle();
	};

	return (
		<Center
			ref={refHandler}
			className={clsx("swipe-handler", placement, isOpen && "open")}
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
	const root = useRef<HTMLElement | null>(null);
	const animation = useRef<AnimatableObject | null>(null);
	const animScope = useRef<Scope | null>(null);
	// Listen to swipe event on the overlay
	// useSwipe({
	// 	preventDefault: isOpen,
	// 	stopPropagation: true,
	// 	onSwipe: (swipeDirection) => {
	// 		if (swipeDirection === "top" || swipeDirection === "bottom") {
	// 			return;
	// 		}
	// 		if (placement === "left") {
	// 			return swipeDirection === "right" ? open() : close();
	// 		}
	// 		if (placement === "right") {
	// 			return swipeDirection === "left" ? open() : close();
	// 		}
	// 	},
	// 	onTap: close
	// });

	// Effect for Escape key

	/**
	 * Declare Anime.js animations
	 * @ref https://animejs.com/documentation/getting-started/using-with-react/
	 */
	useSafeLayoutEffect(() => {
		animScope.current = createScope().add(() => {
			createDraggable(".drawer-content", {
				trigger: ".swipe-handler",
				x: { snap: [-240, 0] },
				y: false,
				container: [0, 10, 0, -240], // top, right, bottom, left
				releaseEase: "outElastic",
				onSettle: (panel) => {
					if (panel.x === 0) {
						root.current?.classList.add("open");
						open();
					}
					if (panel.x === -240) {
						root.current?.classList.remove("open");
						close();
					}
				}
			});

			animation.current = createAnimatable(".drawer-content", {
				translateX: {
					unit: "px",
					duration: 500,
					ease: "easeOutQuad"
				}
			});
		});

		// Properly cleanup all anime.js instances declared inside this scope
		return () => animScope.current?.revert();
	}, []);

	useSafeLayoutEffect(() => {
		if (isOpen) {
			animation.current?.translateX(0);
		} else {
			animation.current?.translateX(-240);
		}
	}, [isOpen]);

	const handleOverlayClick: MouseEventHandler = (evt) => {
		evt.preventDefault();
		evt.stopPropagation();
		close();
	};

	return (
		<>
			<Box
				as="aside"
				ref={root}
				className={clsx("drawer-content", placement, isOpen && "open")}
				style={{ transform: `translateX(${isOpen ? "0" : "-240px"})` }}
				aria-hidden={!isOpen}
				tabIndex={-1} // Makes the drawer focusable, e.g., for ENTER
			>
				{children}
				{showHandler && (
					<SwipeHandler isOpen={isOpen} toggle={toggle} placement={placement} />
				)}
			</Box>
			{showOverlay && (
				<Box
					className={clsx("drawer-overlay", isOpen && "drawer-overlay--open")}
					onClick={handleOverlayClick}
				/>
			)}
		</>
	);
};
