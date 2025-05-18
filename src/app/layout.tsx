import type { FC, PropsWithChildren } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
	<html lang="en">
		<head>
			<link
				href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&display=swap"
				rel="stylesheet"
			/>
			<link rel="icon" href="/movie-icon.svg" />
		</head>
		<body>
			<ChakraProvider value={theme}>{children}</ChakraProvider>
		</body>
	</html>
);

export default RootLayout;
