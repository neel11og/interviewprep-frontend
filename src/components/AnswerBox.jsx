// src/components/AnswerBox.jsx
import { useState } from "react";
import {
  Box,
  Textarea,
  Button,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const AnswerBox = () => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim() !== "") {
      alert("Submitted Answer: " + answer);
      setAnswer("");
    }
  };

  return (
    <Box
      bg={useColorModeValue("white", "gray.700")}
      p={6}
      rounded="md"
      shadow="md"
      border="1px solid"
      borderColor={useColorModeValue("gray.300", "gray.600")}
    >
      <VStack align="start" spacing={4}>
        <Text fontSize="md" fontWeight="semibold" color={useColorModeValue("gray.700", "gray.200")}>
          ✍️ Your Answer
        </Text>

        <Textarea
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          size="md"
          resize="vertical"
          minHeight="120px"
          borderColor={useColorModeValue("gray.300", "gray.600")}
          focusBorderColor="purple.500"
          bg={useColorModeValue("white", "gray.800")}
          color={useColorModeValue("gray.800", "gray.100")}
        />

        <Button
          colorScheme="purple"
          onClick={handleSubmit}
          alignSelf="flex-end"
          isDisabled={answer.trim() === ""}
        >
          Submit Answer
        </Button>
      </VStack>
    </Box>
  );
};

export default AnswerBox;
