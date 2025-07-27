import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import theme from "./theme";
import Layout from "./components/Layout";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
import AIInterview from "./pages/AIInterview";
import Home from "./pages/Home";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/ai-interview" element={<AIInterview />} />
        </Route>
      </Routes>
    </ChakraProvider>
  );
}

export default App;
