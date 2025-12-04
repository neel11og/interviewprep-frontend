import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },

  colors: {
    brand: {
      primary: "#a855f7", 
      secondary: "#7e22ce",
    },
    background: "#0a0514", 
  },

  fonts: {
    heading: "'Orbitron', sans-serif",
    body: "'Roboto', sans-serif",
  },

  styles: {
    global: {
      "html, body": {
        bg: "background",
        color: "whiteAlpha.800",
        margin: 0,
        padding: 0,
        height: "100%",
      },
      "#root": {
        height: "100%",
      },
    },
  },

  components: {
    Button: {
      variants: {
        glow: {
          bg: "transparent",
          border: "2px solid",
          borderColor: "brand.primary",
          color: "brand.primary",
          fontWeight: "bold",
          textShadow: "0 0 5px #a855f7",
          transition: "all 0.3s ease-in-out",
          _hover: {
            boxShadow: "0 0 20px 5px rgba(168, 85, 247, 0.5)",
            bg: "rgba(168, 85, 247, 0.1)",
            transform: "scale(1.05)",
          },
          _active: { transform: "scale(0.95)" },
        },
      },
    },
    Box: {
      variants: {
        glass: {
          bg: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "2xl",
          boxShadow: "xl",
        },
      },
    },
    ModalContent: {
      baseStyle: {
        bg: "rgba(10, 5, 20, 0.6)",
        backdropFilter: "blur(15px)",
        border: "1px solid",
        borderColor: "brand.primary",
        boxShadow: "0 0 30px 10px rgba(168, 85, 247, 0.2)",
      },
    },
  },
});

export default theme;