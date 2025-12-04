// src/pages/Home.jsx
import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import Starfield from "../components/Starfield";
import AuthModal from "../components/AuthModal";

const FeatureCard = ({ title, description, onOpen }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onOpen}>
      <Box
        bg="rgba(255,255,255,0.05)"
        p={6}
        borderRadius="md"
        boxShadow="lg"
        maxW="300px"
        cursor="pointer"
        border="1px solid rgba(255,255,255,0.1)"
      >
        <Heading size="md" mb={4} color="teal.200">
          {title}
        </Heading>
        <Text>{description}</Text>
      </Box>
    </motion.div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated } = useAuth();
  const [activeFeature, setActiveFeature] = useState(null);
  const [isAuthOpen, setAuthOpen] = useState(false);

  const features = [
    {
      title: "✨ AI-Powered Interviews",
      description: "Face a smart AI interviewer that adapts to your answers.",
      details:
        "Our AI analyzes your responses in real-time, asking follow-ups just like a human. Perfect for practicing behavioral, technical, or case interviews!",
    },
    {
      title: "📄 Resume-Based Prep",
      description: "Get questions tailored to YOUR resume.",
      details:
        "Upload your resume, and we’ll generate personalized questions based on your skills, experience, and job goals.",
    },
    {
      title: "🚀 Instant Feedback",
      description: "Know exactly where to improve.",
      details:
        "Get real-time scores on clarity, confidence, and content. We’ll highlight filler words, weak phrases, and even suggest better answers!",
    },
  ];

  const handleCardClick = (index) => {
    setActiveFeature(index);
    onOpen();
  };

  return (
    <Box position="relative" minH="100vh" overflow="hidden">
      {/* Starfield Background */}
      <Starfield starCount={1000} speed={0.5} style={{ position: "fixed", zIndex: -1 }} />

      {/* Main Hero */}
      <VStack
        minH="70vh"
        justify="center"
        align="center"
        spacing={8}
        px={4}
        textAlign="center"
        zIndex={2}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Heading size="2xl" bgGradient="linear(to-r, teal.300, blue.500)" bgClip="text">
            InterviewPrep.AI
          </Heading>
        </motion.div>

        <Text fontSize="xl" maxW="600px" opacity={0.9}>
          Your resume → <b>AI-powered interview coach</b>. Practice. Get feedback.{" "}
          <b>Get hired.</b>
        </Text>

        {/* CTA Button → opens AuthModal (Firebase login/signup) */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => isAuthenticated ? navigate("/dashboard") : setAuthOpen(true)}
            bgGradient="linear(to-r, teal.300, blue.500)"
            colorScheme="teal"
            size="lg"
            px={8}
            borderRadius="lg"
          >
            {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
          </Button>

          <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
        </motion.div>
      </VStack>

      {/* Feature Cards */}
      <HStack
        spacing={8}
        px={8}
        py={16}
        wrap="wrap"
        justify="center"
        align="stretch"
        zIndex={2}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            onOpen={() => handleCardClick(index)}
          />
        ))}
      </HStack>

      {/* Feature Details Modal */}
      <AnimatePresence>
        {isOpen && (
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay bg="blackAlpha.700" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <ModalContent
                bg="linear-gradient(135deg, #1a202c, #2d3748)"
                border="1px solid"
                borderColor="teal.400"
                borderRadius="xl"
                p={6}
              >
                <ModalHeader fontSize="2xl" color="teal.300">
                  {features[activeFeature]?.title}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text mb={6}>{features[activeFeature]?.details}</Text>
                  <Button
                    colorScheme="teal"
                    w="full"
                    onClick={() => setAuthOpen(true)} // ✅ triggers Auth modal
                  >
                    Try It Now
                  </Button>
                </ModalBody>
              </ModalContent>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
}