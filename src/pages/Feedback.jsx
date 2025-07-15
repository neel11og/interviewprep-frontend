import {
  Box,
  Heading,
  VStack,
  Text,
  Textarea,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const toast = useToast();

  const handleSubmit = () => {
    if (feedback.trim() === "") {
      toast({
        title: "Feedback is empty.",
        description: "Please write some feedback before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // In real app, send feedback to backend
    toast({
      title: "Thank you!",
      description: "Your feedback has been submitted.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setFeedback("");
  };

  return (
    <Box maxW="container.md" mx="auto" px={{ base: 4, md: 8 }} py={6}>
      <VStack spacing={6} align="stretch">
        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          textAlign="center"
        >
          We Value Your Feedback
        </Heading>

        <Text fontSize={{ base: "md", md: "lg" }} textAlign="center">
          Let us know how we can improve InterviewPrep.AI
        </Text>

        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your thoughts..."
          size="md"
          minH="120px"
          resize="vertical"
          bg="white"
          _focus={{ borderColor: "purple.500", boxShadow: "outline" }}
        />

        <Button
          onClick={handleSubmit}
          colorScheme="purple"
          size="lg"
          alignSelf={{ base: "stretch", md: "flex-start" }}
        >
          Submit Feedback
        </Button>
      </VStack>
    </Box>
  );
};

export default Feedback;
