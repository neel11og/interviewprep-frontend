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

  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Box
      bg={bgColor}
      p={6}
      rounded="md"
      shadow="md"
      border="1px solid"
      borderColor={borderColor}
      w="full"
    >
      <VStack align="start" spacing={4}>
        <Text fontSize="md" fontWeight="semibold" color={textColor}>
          ✍️ Your Answer
        </Text>

        <Textarea
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          size="md"
          resize="vertical"
          minHeight="120px"
          borderColor={borderColor}
          focusBorderColor="purple.500"
          bg={useColorModeValue("white", "gray.800")}
          color={textColor}
          _placeholder={{ color: placeholderColor }}
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
