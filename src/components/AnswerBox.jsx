// src/components/AnswerBox.jsx
import { Box, Textarea, Button, Text } from "@chakra-ui/react";
import { useState } from "react";

const AnswerBox = () => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    alert("Submitted: " + answer);
    setAnswer("");
  };

  return (
    <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="xl" shadow="md">
      <Text mb={2} fontWeight="semibold" fontSize="md">
        ✍️ Your Answer
      </Text>
      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer..."
        resize="vertical"
        minH="120px"
        mb={4}
      />
      <Button
        colorScheme="purple"
        size="md"
        w={{ base: "full", md: "auto" }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AnswerBox;
