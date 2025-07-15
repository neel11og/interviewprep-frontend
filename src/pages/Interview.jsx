// src/pages/Interview.jsx
import { Box, Heading, VStack, Select, Text, Stack } from "@chakra-ui/react";
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
    <Box maxW="container.md" mx="auto" px={{ base: 4, md: 8 }} py={6}>
      <VStack spacing={6} align="stretch">
        <Heading
          as="h1"
          size="lg"
          textAlign="center"
          fontSize={{ base: "2xl", md: "3xl" }}
        >
          Practice Interview Questions
        </Heading>

        <Box>
          <Text fontWeight="medium" mb={2}>
            Select Category:
          </Text>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
