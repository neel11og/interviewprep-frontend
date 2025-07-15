// src/components/QuestionCard.jsx
import { Box, Text } from "@chakra-ui/react";

const QuestionCard = ({ question }) => {
  return (
    <Box
      p={{ base: 4, md: 6 }}
      bg="white"
      borderRadius="xl"
      shadow="md"
      w="full"
    >
      <Text fontSize={{ base: "md", md: "lg" }} color="gray.800">
        🧠 {question}
      </Text>
    </Box>
  );
};

export default QuestionCard;
