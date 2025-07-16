import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  useToast,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaRobot, FaQuestionCircle } from "react-icons/fa";
import axios from "axios";

const AIInterview = () => {
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    setCategory(storedCategory || "General");
    fetchQuestion(storedCategory || "General");
  }, []);

  const fetchQuestion = async (cat) => {
    try {
      const res = await axios.get(`http://localhost:8000/questions/random?category=${cat}`);
      setQuestion(res.data.question);
    } catch (err) {
      toast({
        title: "Failed to load question",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAskGemini = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/gemini/ask", {
        prompt: `Category: ${category}\nQuestion: ${question}\nAnswer: ${answer}`,
      });
      setAIResponse(res.data.response);
    } catch (err) {
      setAIResponse("❌ Gemini Error: " + (err?.response?.data?.detail || "Something went wrong."));
    }
    setLoading(false);
  };

  return (
    <Box minH="100vh" p={8} bg={useColorModeValue("gray.50", "gray.900")}>
      <VStack spacing={6}>
        <Heading color="purple.500" textAlign="center">
          <FaRobot style={{ marginBottom: "-5px" }} /> AI Interview Practice
        </Heading>

        <Box
          w="100%"
          maxW="800px"
          p={6}
          bg={cardBg}
          borderRadius="lg"
          boxShadow="lg"
        >
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            <FaQuestionCircle style={{ marginRight: "8px" }} />
            Question:
          </Text>
          <Text fontSize="md" mb={4}>{question}</Text>

          <Text fontSize="sm" mb={1}>Your Answer:</Text>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: useColorModeValue("#f9f9f9", "#2D3748"),
              color: useColorModeValue("black", "white"),
              border: "1px solid #ccc",
            }}
          />

          <Button
            mt={4}
            colorScheme="purple"
            onClick={handleAskGemini}
            isLoading={loading}
          >
            Ask Gemini
          </Button>

          {aiResponse && (
            <Box mt={6} bg="green.50" _dark={{ bg: "green.900" }} p={4} borderRadius="md">
              <Text fontWeight="bold">Gemini’s Feedback:</Text>
              <Text mt={2}>{aiResponse}</Text>
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default AIInterview;
