import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        borderRadius: "xl",
      },
    },
    Textarea: {
      baseStyle: {
        borderRadius: "xl",
      },
    },
    Select: {
      baseStyle: {
        borderRadius: "xl",
      },
    },
  },
});
export default theme;
