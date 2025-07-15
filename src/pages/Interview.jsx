// src/pages/Interview.jsx
import {
  Box,
  Heading,
  VStack,
  Select,
  Text,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import QuestionCard from "../components/QuestionCard";
import AnswerBox from "../components/AnswerBox";
import { useState, useEffect } from "react";

const Interview = () => {
  const [category, setCategory] = useState("General");
  const [question, setQuestion] = useState("");

  const categories = ["General", "Technical", "HR", "Behavioral"];

  const getRandomQuestion = () => {
    const sampleQuestions = {
      General: [
        "Tell me about yourself.",
        "Why do you want this job?",
        "What are your strengths and weaknesses?",
      ],
      Technical: [
        "What is the difference between REST and GraphQL?",
        "Explain how a binary search works.",
        "What are the main principles of OOP?",
      ],
      HR: [
        "Where do you see yourself in 5 years?",
        "Why did you leave your last job?",
        "Describe a time you faced conflict at work.",
      ],
      Behavioral: [
        "Tell me about a time you took initiative.",
        "Describe a difficult decision you had to make.",
        "Tell me about a mistake you made and what you learned.",
      ],
    };

    const questions = sampleQuestions[category];
    const random = questions[Math.floor(Math.random() * questions.length)];
    setQuestion(random);
  };

  useEffect(() => {
    getRandomQuestion();
  }, [category]);

  return (
    <Box
      maxW="100%"
      px={{ base: 4, sm: 6, md: 10 }}
      py={{ base: 4, md: 8 }}
      minH="100vh"
      bg="gray.50"
    >
      <VStack spacing={6} align="stretch" w="full">
        <Heading
          as="h1"
          textAlign="center"
          fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
        >
          Interview Practice
        </Heading>

        <Box>
          <Text mb={2} fontSize={{ base: "md", md: "lg" }}>
            Select a category:
          </Text>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            bg="white"
            w="full"
            maxW={{ base: "100%", md: "300px" }}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </Select>
        </Box>

        <QuestionCard question={question} />
        <AnswerBox />
      </VStack>
    </Box>
  );
};

export default Interview;
