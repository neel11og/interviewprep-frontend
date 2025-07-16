import { Routes, Route } from "react-router-dom";
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
import AIInterview from "./pages/AIInterview";
import CategorySelection from "./pages/CategorySelection"; // ✅ ADD THIS
import Layout from "./components/Layout";

// Optional: Custom theme (you can customize colors here)
const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

function App() {
  const theme = extendTheme({
    config: {
      initialColorMode: "light",
      useSystemColorMode: false,
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CategorySelection />} />       {/* ✅ Default page */}
          <Route path="/interview" element={<Interview />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/ai-interview" element={<AIInterview />} />
        </Route>
      </Routes>
    </ChakraProvider>
  );
}

export default App;