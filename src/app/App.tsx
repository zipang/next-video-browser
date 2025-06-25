import { Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./home";
import { theme } from "./theme";

function App() {
	return (
		<ChakraProvider value={theme}>
			<Routes>
				<Route path="/" element={<Home />} />
			</Routes>
		</ChakraProvider>
	);
}

export default App;
