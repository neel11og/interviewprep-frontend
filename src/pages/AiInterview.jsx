import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaRobot, FaQuestionCircle } from "react-icons/fa";
import axios from "axios";
import { animatedBackgroundStyle } from "../styles/animatedBackground";

const AIInterview = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const cardBg = useColorModeValue("gray.100", "#1A202C");
  const textColor = useColorModeValue("black", "white");

  const fetchQuestionAndAnswer = async () => {
    setLoading(true);
    setResponse("");

    try {
      // 1. Get random question from backend
      const qRes = await axios.get("http://127.0.0.1:8000/questions/random");
      const q = qRes.data.question;
      setQuestion(q);

      // 2. Send question to Gemini API backend route
      const aRes = await axios.post("http://127.0.0.1:8000/gemini/ask", {
        prompt: q,
      });

      setResponse(aRes.data.response);
    } catch (err) {
      setResponse("❌ Failed to generate AI response.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionAndAnswer();
  }, []);

  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={4}
      style={animatedBackgroundStyle}
    >
      <Box
        bg={cardBg}
        p={8}
        rounded="xl"
        shadow="xl"
        w={{ base: "100%", sm: "90%", md: "700px" }}
        color={textColor}
      >
        <VStack spacing={6} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">
            <FaQuestionCircle/>  Question:
          </Text>
          <Text
            fontSize="lg"
            p={4}
            rounded="xl"
            bg={useColorModeValue("white", "#2D3748")}
          >
            {question}
          </Text>

          <Text fontSize="2xl" fontWeight="bold">
            <FaRobot /> AI Response:
          </Text>
          <Box
            p={4}
            bg={useColorModeValue("white", "#2D3748")}
            rounded="xl"
            minH="150px"
          >
            {loading ? <Spinner size="lg" color="purple.400" /> : <Text>{response}</Text>}
          </Box>

          <Button
            onClick={fetchQuestionAndAnswer}
            colorScheme="purple"
            rounded="xl"
          >
            🔁 Ask Another
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default AIInterview;
