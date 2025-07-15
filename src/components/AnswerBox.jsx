import { useState } from "react";
import { Box, Text, Textarea, Button, useToast } from "@chakra-ui/react";

function AnswerBox() {
  const [answer, setAnswer] = useState("");
  const toast = useToast();

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast({
        title: "Answer cannot be empty.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Answer submitted!",
      description: "Your answer was successfully recorded.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setAnswer("");
  };

  return (
    <Box
      p={6}
      bg="white"
      border="1px solid"
      borderColor="purple.100"
      rounded="lg"
      shadow="sm"
    >
      <Text fontWeight="semibold" mb={3} fontSize="md" color="gray.700">
        ✍️ Your Answer
      </Text>
      <Textarea
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        size="md"
        resize="none"
        h="120px"
        borderColor="gray.300"
        focusBorderColor="purple.500"
        mb={4}
      />
      <Button
        colorScheme="purple"
        onClick={handleSubmit}
        fontWeight="bold"
        px={6}
      >
        Submit Answer
      </Button>
    </Box>
  );
}

export default AnswerBox;
