// src/pages/Interview.jsx
import {
  Box,
  Heading,
  VStack,
  Select,
  Text,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { animatedBackgroundStyle } from "../styles/animatedBackground";
import { useEffect, useState } from "react";
import AnswerBox from "../components/AnswerBox";
import axios from "axios";

const Interview = () => {
  const [category, setCategory] = useState("Data Structures");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const questions = {
    "Data Structures": [
      "What is the difference between an array and a linked list?",
      "Explain the concept of a binary search tree.",
      "What is a hash table and how does it work?",
    ],
    "Algorithms": [
      "What is the time complexity of quicksort?",
      "Explain the difference between BFS and DFS.",
      "What is dynamic programming? Give an example.",
    ],
    "System Design": [
      "How would you design a URL shortening service?",
      "Explain the concept of load balancing.",
      "What is a CDN and how does it work?",
    ],
    "OOP Concepts": [
      "What is polymorphism in object-oriented programming?",
      "Explain the SOLID principles.",
      "What is the difference between abstraction and encapsulation?",
    ],
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const getRandomQuestion = () => {
    const categoryQuestions = questions[category];
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    return categoryQuestions[randomIndex];
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const q = getRandomQuestion();
      setQuestion(q);
      setLoading(false);
    }, 500);
  }, [category]);

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
        borderRadius="xl"
        position="relative"
        bg={useColorModeValue("rgba(255, 255, 255, 0.2)","rgba(0, 0, 0, 0.5)")}
        boxShadow="lg"
        px={[4, 8]}
        py={[8, 16]}
        minH="100vh"
      >
        
      <VStack spacing={6} align="center" maxW="3xl" mx="auto">
        <Heading size="lg" color={useColorModeValue(("#dee9ffff", "#000a17ff"))}>
          🎯 Interview Practice
        </Heading>

        <Select
          value={category}
          onChange={handleCategoryChange}
          bg={useColorModeValue("white", "gray.700")}
          borderColor={useColorModeValue("gray.300", "gray.600")}
        >
          {Object.keys(questions).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>

        {loading ? (
          <Spinner size="lg" alignSelf="center" />
        ) : (
          <Box
            p={6}
            rounded="lg"
            bg={useColorModeValue("white", "gray.700")}
            shadow="md"
            border="1px solid"
            borderColor={useColorModeValue("gray.300", "gray.600")}
          >
            <Text fontSize="lg" fontWeight="medium">
              🧠 {question}
            </Text>
          </Box>
        )}

        <AnswerBox />
      </VStack>
      </Box>
     </Box>
    
  );
};

export default Interview;
