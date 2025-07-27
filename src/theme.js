// src/theme.js
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: mode("#F8F9FA", "#121212")(props), // Light / Dark background
        color: mode("#1A1A1A", "#EDEDED")(props), // Text colors
        transition: "all 0.3s ease-in-out",
      },
    }),
  },
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Poppins, sans-serif",
  },
  colors: {
    brand: {
      50: "#f3e8ff",
      100: "#e9d5ff",
      200: "#d8b4fe",
      300: "#c084fc",
      400: "#a855f7", // Main accent purple
      500: "#9333ea",
      600: "#7e22ce",
      700: "#6b21a8",
      800: "#581c87",
      900: "#3b0764",
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "9999px", // Fully rounded
        fontWeight: "semibold",
        transition: "all 0.3s ease-in-out",
      },
      variants: {
        solid: (props) => ({
          bg: mode("brand.400", "brand.600")(props),
          color: "white",
          _hover: {
            bg: mode("brand.500", "brand.700")(props),
            transform: "scale(1.05)",
            boxShadow: "lg",
          },
          _active: {
            transform: "scale(0.97)",
          },
        }),
        outline: (props) => ({
          border: "2px solid",
          borderColor: mode("brand.400", "brand.600")(props),
          color: mode("brand.600", "brand.400")(props),
          _hover: {
            bg: mode("brand.50", "brand.800")(props),
            transform: "scale(1.05)",
            boxShadow: "md",
          },
        }),
      },
    },
  },
});

export default theme;
