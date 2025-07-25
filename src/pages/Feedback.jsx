import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Textarea,
  Button,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const toast = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback cannot be empty.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/feedback", { feedback });
      toast({
        title: "Thank you for your feedback!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFeedback("");
    } catch (error) {
      toast({
        title: "Error submitting feedback.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const bgColor = useColorModeValue("#ffffffdd", "#1A202C");
  const boxBg = useColorModeValue("#f0f0f0", "#2D3748");
  const buttonBg = useColorModeValue("purple.300", "purple.500");

  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={4}
      py={10}
    >
      <Box
        bg={boxBg}
        color={useColorModeValue("black", "white")}
        p={8}
        rounded="lg"
        shadow="xl"
        w={{ base: "100%", sm: "90%", md: "600px" }}
      >
        <Heading mb={4} textAlign="center" fontSize="2xl">
          We Value Your Feedback
        </Heading>
        <Text mb={6} textAlign="center" fontSize="md">
          Let us know how we can improve InterviewPrep.AI
        </Text>
        <Textarea
          placeholder="Type your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          mb={6}
          bg={bgColor}
          color={useColorModeValue("black", "white")}
          border="1px solid"
          borderColor={useColorModeValue("gray.300", "gray.600")}
          _focus={{ borderColor: "purple.400", boxShadow: "outline" }}
        />
        <Button
          onClick={handleSubmit}
          colorScheme="purple"
          bg={buttonBg}
          color="white"
          _hover={{ bg: "purple.600" }}
          w="100%"
        >
          Submit Feedback
        </Button>
      </Box>
    </Box>
  );
};

export default Feedback;
