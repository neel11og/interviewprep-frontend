// src/pages/Interview.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Textarea,
  Text,
  VStack,
  HStack,
  Spinner,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Progress,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  useToast,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaCheck, FaClock, FaStar } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { questionsAPI, interviewAPI, apiUtils } from "../services/api";
import config from "../config/environment";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function Interview() {
  const navigate = useNavigate();
  const toast = useToast();
  const { backendUser, isAuthenticated } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [results, setResults] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Fetch questions from backend
  useEffect(() => {
    if (isAuthenticated) {
      fetchQuestions();
    }
  }, [isAuthenticated]);

  // Timer for each question
  useEffect(() => {
    if (questions.length > 0 && !interviewComplete) {
      setTimeRemaining(300); // 5 minutes per question
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentIndex, questions.length, interviewComplete]);

  const fetchQuestions = async () => {
    try {
      setLoadingQuestions(true);
      setError(null);

      // Try to get questions from resume first, then fallback to random questions
      let response;
      try {
        // Get user's latest resume for personalized questions
        const resumeResponse = await questionsAPI.generateFromResume(
          "Generate interview questions based on my resume", // This would be actual resume text
          null,
          []
        );
        response = resumeResponse;
      } catch (resumeError) {
        // Fallback to random questions
        response = await questionsAPI.getRandomQuestions(
          config.interview.defaultQuestionCount,
          "medium"
        );
      }

      if (response.status === "success" && response.data?.questions) {
        setQuestions(response.data.questions);
        
        // Create interview session
        const sessionResponse = await interviewAPI.createSession({
          user_id: backendUser?.id,
          session_name: `Interview Session - ${new Date().toLocaleDateString()}`,
          questions: response.data.questions,
        });

        if (sessionResponse.status === "success") {
          setSessionId(sessionResponse.data.id);
        }
      } else {
        throw new Error("Failed to load questions");
      }
    } catch (err) {
      const errorInfo = apiUtils.handleError(err);
      setError(errorInfo.message);
      console.error("Error fetching questions:", errorInfo);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast({
        title: "Please provide an answer",
        description: "Type your answer before submitting",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoadingEvaluation(true);
    try {
      const response = await interviewAPI.submitAnswer(
        sessionId,
        currentIndex,
        answer,
        "Resume context would go here" // This would be actual resume text
      );

      if (response.status === "success") {
        setFeedback(response.data);
        setResults(prev => [
          ...prev,
          {
            question: questions[currentIndex],
            answer,
            score: response.data.score,
            level: response.data.level,
            feedback: response.data.feedback,
            strengths: response.data.strengths,
            improvements: response.data.improvements,
          },
        ]);

        toast({
          title: "Answer submitted!",
          description: `Score: ${response.data.score}/10`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(response.message || "Failed to submit answer");
      }
    } catch (err) {
      const errorInfo = apiUtils.handleError(err);
      toast({
        title: "Submission failed",
        description: errorInfo.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoadingEvaluation(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setAnswer("");
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleCompleteInterview();
    }
  };

  const handleCompleteInterview = async () => {
    try {
      if (sessionId) {
        await interviewAPI.completeSession(sessionId);
      }
      setInterviewComplete(true);
      
      toast({
        title: "Interview completed! 🎉",
        description: "Great job! Check your results below.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error completing interview:", err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 6) return "yellow";
    return "red";
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "expert": return "purple";
      case "advanced": return "blue";
      case "intermediate": return "green";
      case "beginner": return "orange";
      default: return "gray";
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (loadingQuestions) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" />
          <Text>Loading interview questions...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxW="600px" mx="auto" mt={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          mt={4}
          colorScheme="teal"
          onClick={fetchQuestions}
          leftIcon={<FaArrowLeft />}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  if (interviewComplete) {
    const averageScore = results.length > 0 
      ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)
      : 0;

    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        maxW="800px"
        mx="auto"
        mt={8}
      >
        <VStack spacing={6}>
          <Card bg={cardBg} w="100%">
            <CardHeader textAlign="center">
              <VStack spacing={4}>
                <Heading size="lg" color="teal.400">
                  Interview Complete! 🎉
                </Heading>
                <HStack spacing={6}>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="bold" color="teal.400">
                      {averageScore}/10
                    </Text>
                    <Text fontSize="sm" opacity={0.7}>Average Score</Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.400">
                      {questions.length}
                    </Text>
                    <Text fontSize="sm" opacity={0.7}>Questions</Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="bold" color="green.400">
                      {results.filter(r => r.score >= 7).length}
                    </Text>
                    <Text fontSize="sm" opacity={0.7}>Strong Answers</Text>
                  </VStack>
                </HStack>
              </VStack>
            </CardHeader>
          </Card>

          <VStack spacing={4} w="100%">
            {results.map((result, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                bg={cardBg}
                w="100%"
                border="1px solid"
                borderColor={borderColor}
              >
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={2} flex={1}>
                        <Text fontWeight="bold" fontSize="lg">
                          Question {index + 1}
                        </Text>
                        <Text>{result.question}</Text>
                      </VStack>
                      <HStack spacing={2}>
                        <Badge colorScheme={getScoreColor(result.score)} variant="solid">
                          {result.score}/10
                        </Badge>
                        <Badge colorScheme={getLevelColor(result.level)} variant="outline">
                          {result.level}
                        </Badge>
                      </HStack>
                    </HStack>

                    <Divider />

                    <VStack align="start" spacing={2}>
                      <Text fontWeight="medium">Your Answer:</Text>
                      <Text fontSize="sm" opacity={0.8}>
                        {result.answer}
                      </Text>
                    </VStack>

                    <VStack align="start" spacing={2}>
                      <Text fontWeight="medium">Feedback:</Text>
                      <Text fontSize="sm">{result.feedback}</Text>
                    </VStack>

                    {result.strengths && result.strengths.length > 0 && (
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="medium" color="green.400">Strengths:</Text>
                        <HStack spacing={2} wrap="wrap">
                          {result.strengths.map((strength, i) => (
                            <Badge key={i} colorScheme="green" variant="subtle">
                              {strength}
                            </Badge>
                          ))}
                        </HStack>
                      </VStack>
                    )}

                    {result.improvements && result.improvements.length > 0 && (
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="medium" color="orange.400">Areas for Improvement:</Text>
                        <HStack spacing={2} wrap="wrap">
                          {result.improvements.map((improvement, i) => (
                            <Badge key={i} colorScheme="orange" variant="subtle">
                              {improvement}
                            </Badge>
                          ))}
                        </HStack>
                      </VStack>
                    )}
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </VStack>

          <HStack spacing={4}>
            <Button
              colorScheme="blue"
              onClick={() => navigate("/dashboard")}
              leftIcon={<FaArrowLeft />}
            >
              Back to Dashboard
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => navigate("/feedback")}
              rightIcon={<FaCheck />}
            >
              View Detailed Feedback
            </Button>
          </HStack>
        </VStack>
      </MotionBox>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      maxW="800px"
      mx="auto"
      mt={8}
    >
      <VStack spacing={6}>
        {/* Progress Header */}
        <Card bg={cardBg} w="100%">
          <CardBody>
            <VStack spacing={4}>
              <HStack justify="space-between" w="100%">
                <Text fontWeight="bold" fontSize="lg">
                  Question {currentIndex + 1} of {questions.length}
                </Text>
                <HStack spacing={2}>
                  <FaClock />
                  <Text fontWeight="bold" color={timeRemaining < 60 ? "red.400" : "teal.400"}>
                    {formatTime(timeRemaining)}
                  </Text>
                </HStack>
              </HStack>
              
              <Progress
                value={((currentIndex + 1) / questions.length) * 100}
                w="100%"
                colorScheme="teal"
                borderRadius="full"
                size="lg"
                hasStripe
                isAnimated
              />
            </VStack>
          </CardBody>
        </Card>

        {/* Question Card */}
        <MotionCard
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          bg={cardBg}
          w="100%"
          border="1px solid"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading size="md" color={textColor}>
              {questions[currentIndex]}
            </Heading>
          </CardHeader>
          
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                size="lg"
                minH="200px"
                resize="vertical"
                _focus={{ borderColor: "teal.400" }}
              />

              <AnimatePresence>
                {feedback && (
                  <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card bg="blue.50" _dark={{ bg: "blue.900" }} border="1px solid" borderColor="blue.200" _dark={{ borderColor: "blue.700" }}>
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          <HStack justify="space-between">
                            <Text fontWeight="bold" color="blue.600" _dark={{ color: "blue.300" }}>
                              Feedback
                            </Text>
                            <HStack spacing={2}>
                              <Badge colorScheme={getScoreColor(feedback.score)} variant="solid">
                                {feedback.score}/10
                              </Badge>
                              <Badge colorScheme={getLevelColor(feedback.level)} variant="outline">
                                {feedback.level}
                              </Badge>
                            </HStack>
                          </HStack>
                          
                          <Text fontSize="sm">{feedback.feedback}</Text>
                          
                          {feedback.strengths && feedback.strengths.length > 0 && (
                            <VStack align="start" spacing={1}>
                              <Text fontSize="sm" fontWeight="medium" color="green.600" _dark={{ color: "green.300" }}>
                                Strengths:
                              </Text>
                              <Text fontSize="sm">{feedback.strengths.join(", ")}</Text>
                            </VStack>
                          )}
                          
                          {feedback.improvements && feedback.improvements.length > 0 && (
                            <VStack align="start" spacing={1}>
                              <Text fontSize="sm" fontWeight="medium" color="orange.600" _dark={{ color: "orange.300" }}>
                                Areas for Improvement:
                              </Text>
                              <Text fontSize="sm">{feedback.improvements.join(", ")}</Text>
                            </VStack>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </MotionBox>
                )}
              </AnimatePresence>

              <HStack justify="space-between">
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  leftIcon={<FaArrowLeft />}
                  isDisabled={loadingEvaluation}
                >
                  Exit Interview
                </Button>

                {!feedback ? (
                  <Button
                    colorScheme="teal"
                    onClick={handleSubmit}
                    isLoading={loadingEvaluation}
                    loadingText="Evaluating..."
                    rightIcon={<FaCheck />}
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    colorScheme="blue"
                    onClick={handleNext}
                    rightIcon={currentIndex + 1 === questions.length ? <FaCheck /> : <FaArrowRight />}
                  >
                    {currentIndex + 1 === questions.length ? "Finish Interview" : "Next Question"}
                  </Button>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </MotionCard>
      </VStack>
    </MotionBox>
  );
}