"use client";
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
	theme: {
		fonts: {
			heading: "Montserrat, system-ui, sans-serif",
			body: "Montserrat, system-ui, sans-serif",
		},
		breakpoints: {
			sm: "320px",
			md: "768px",
			lg: "960px",
			xl: "1200px",
		},
		tokens: {
			colors: {
				red: "#EE0F0F",
			},
		},
		semanticTokens: {
			colors: {
				danger: { value: "{colors.red}" },
			},
		},
		components: {
			Heading: {
				baseStyle: {
					color: "palette.black",
					fontWeight: "900",
					letterSpacing: "-0.02em",
				},
			},
			Text: {
				baseStyle: {
					fontWeight: "500",
					letterSpacing: "0.01em",
				},
			},
		},
	},
});

export const theme = createSystem(defaultConfig, config);
