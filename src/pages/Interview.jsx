// src/pages/Interview.jsx
import { useColorModeValue } from "@chakra-ui/react";
import { Box, Heading, VStack, Select, Text } from "@chakra-ui/react";
import QuestionCard from "../components/QuestionCard";
import AnswerBox from "../components/AnswerBox";
import { useState } from "react";

function Interview() {
  const [category, setCategory] = useState("Artificial Intelligence");

  return (
    <Box bg="gray.50" minH="100vh" py={10} px={4}>
      <VStack spacing={8} maxW="4xl" mx="auto" align="stretch">
        <Heading size="xl" textAlign="center" color="purple.700">
          🎯 Smart Interview Practice
        </Heading>

        <Box>
          <Text fontWeight="medium" mb={2}>🧠 Select Category</Text>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            size="md"
            maxW="300px"
            borderColor="purple.400"
            focusBorderColor="purple.600"
          >
            <option>Artificial Intelligence</option>
            <option>Machine Learning</option>
            <option>Data Structures</option>
            <option>Operating Systems</option>
            <option>DBMS</option>
            <option>System Design</option>
          </Select>
        </Box>

        <QuestionCard category={category} />
        <AnswerBox />
      </VStack>
    </Box>
  );
}

export default Interview;
