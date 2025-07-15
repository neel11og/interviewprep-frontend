import { Box, Text, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";

function QuestionCard({ category }) {
  const [question, setQuestion] = useState("");

  const questionBank = {
    "Artificial Intelligence": [
      "What is the Turing Test?",
      "Explain the difference between AI and ML.",
      "What are the limitations of AI?"
    ],
    "Machine Learning": [
      "What is overfitting?",
      "Explain the bias-variance tradeoff.",
      "What is a confusion matrix?"
    ],
    "Data Structures": [
      "What is a binary search tree?",
      "Difference between stack and queue?",
      "Explain the types of linked lists."
    ],
    "Operating Systems": [
      "What is the difference between process and thread?",
      "Explain deadlock and prevention techniques.",
      "What is context switching?"
    ],
    "DBMS": [
      "What is normalization in DBMS?",
      "Difference between SQL and NoSQL?",
      "What is a transaction? Explain ACID properties."
    ],
    "System Design": [
      "Design a URL shortener like Bit.ly.",
      "What is load balancing?",
      "Explain horizontal vs vertical scaling."
    ]
  };

  const getRandomQuestion = () => {
    const questions = questionBank[category] || [];
    const random = questions[Math.floor(Math.random() * questions.length)];
    setQuestion(random);
  };

  useEffect(() => {
    getRandomQuestion();
  }, [category]);

  return (
    <Box
      p={6}
      bg="white"
      border="1px solid"
      borderColor="purple.100"
      rounded="lg"
      shadow="sm"
    >
      <Text fontSize="lg" fontWeight="semibold" mb={3}>
        🎓 Interview Category: <span style={{ color: "#6B46C1" }}>{category}</span>
      </Text>
      <Text fontSize="xl" mb={4} color="gray.800">
        {question}
      </Text>
      <Button colorScheme="purple" onClick={getRandomQuestion}>
        🔄 New Question
      </Button>
    </Box>
  );
}

export default QuestionCard;
