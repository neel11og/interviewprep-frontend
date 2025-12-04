import { ChakraProvider, Box } from "@chakra-ui/react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import theme from "./theme";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ResumeUpload from "./pages/ResumeUpload";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
import AIInterview from "./pages/AIInterview";
import Dashboard from "./pages/Dashboard";

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const particlesConfig = {
  background: { color: { value: "#0a0514" } },
  fullScreen: { enable: true, zIndex: -1 },
  particles: {
    number: { value: 300, density: { enable: true, value_area: 900 } },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.8, random: true },
    size: { value: 1.5, random: { enable: true, minimumValue: 0.5 } },
    move: { enable: true, speed: 0.25, direction: "none", out_mode: "out" },
  },
  interactivity: {
    detectsOn: "window",
    events: { onhover: { enable: true, mode: "parallax" } },
    modes: { parallax: { enable: true, force: 50, smooth: 10 } },
  },
  detectRetina: true,
};

function App() {
  const location = useLocation();
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesConfig}
        />
        
        {/* Main content overlay */}
        <Box position="relative" zIndex="1" minH="100vh">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/resume-upload" element={<ResumeUpload />} />
                <Route path="/interview" element={<Interview />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/ai-interview" element={<AIInterview />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </Box>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;