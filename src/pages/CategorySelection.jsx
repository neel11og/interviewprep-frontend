import React from "react";
import { Box, Heading, Button, VStack, SimpleGrid, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const categories = [
  "Data Structures & Algorithms",
  "Web Development",
  "Backend Systems",
  "Machine Learning",
  "HR / Behavioral",
  "System Design",
];

export default function CategorySelection() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleCategorySelect = (category) => {
    localStorage.setItem("selectedCategory", category);

    toast({
      title: `${category} selected`,
      status: "success",
      duration: 1000,
      isClosable: true,
    });

    setTimeout(() => {
      navigate("/ai-interview");
    }, 1000);
  };

  return (
    <Box minH="100vh" bg="gray.50" p={10}>
      <VStack spacing={8}>
        <Heading color="purple.600" textAlign="center">
          🚀 Choose Your Interview Category
        </Heading>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} w="100%" maxW="800px">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategorySelect(category)}
              colorScheme="purple"
              size="lg"
              borderRadius="lg"
              shadow="md"
              _hover={{ transform: "scale(1.03)" }}
            >
              {category}
            </Button>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
