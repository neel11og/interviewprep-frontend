import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Heading,
  Button,
  Textarea,
  useToast,
} from "@chakra-ui/react";

const sampleQuestions = {
  "Data Structures & Algorithms": [
    "What is a heap? Explain its types.",
    "How does quicksort work?",
    "What is the time complexity of inserting in a binary search tree?",
  ],
  "Web Development": [
    "What is the difference between SSR and CSR?",
    "How does the virtual DOM work in React?",
    "What are web components?",
  ],
  "Backend Systems": [
    "Explain how caching works in backend systems.",
    "What is load balancing?",
    "What is the role of middleware in Express.js?",
  ],
  "Machine Learning": [
    "Explain the difference between supervised and unsupervised learning.",
    "What is overfitting and how to avoid it?",
    "What is gradient descent?",
  ],
  "HR / Behavioral": [
    "Tell me about a time you handled a difficult situation.",
    "Why should we hire you?",
    "Describe a time you failed and what you learned.",
  ],
  "System Design": [
    "Design a URL shortening service like Bitly.",
    "How would you scale an e-commerce website?",
    "Design a chat application like WhatsApp.",
  ],
};

export default function AiInterview() {
  const [category, setCategory] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const toast = useToast();

  useEffect(() => {
    const selected = localStorage.getItem("selectedCategory");
    setCategory(selected || "General");

    const questions = sampleQuestions[selected] || ["No questions available."];
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
  }, []);

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast({
        title: "Answer cannot be empty",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Submitted!",
      description: "AI agent received your answer (mocked).",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    setAnswer("");
  };

  return (
    <Box minH="100vh" bg="gray.50" p={8}>
      <VStack spacing={6} maxW="3xl" mx="auto">
        <Heading size="lg" color="purple.600">
          🤖 Virtual Interview Agent
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Interviewing you for: <strong>{category}</strong>
        </Text>

        <Box
          w="full"
          bg="white"
          p={6}
          borderRadius="md"
          shadow="sm"
          border="1px solid"
          borderColor="gray.200"
        >
          <Text fontSize="md" mb={2}>
            🧠 Question:
          </Text>
          <Text fontSize="xl" color="gray.800" mb={4}>
            {currentQuestion}
          </Text>

          <Textarea
            placeholder="Type your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            resize="vertical"
            mb={4}
          />
          <Button colorScheme="purple" onClick={handleSubmit}>
            Submit Answer
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
