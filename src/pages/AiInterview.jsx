// src/pages/AIInterview.jsx
import React, { useState, useEffect, useRef } from "react";
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
  Avatar,
  Flex,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaCheck, 
  FaClock, 
  FaStar, 
  FaMicrophone, 
  FaStop,
  FaPlay,
  FaRobot,
  FaUser
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { geminiAPI, interviewAPI, resumeAPI, apiUtils } from "../services/api";
import config from "../config/environment";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function AIInterview() {
  const navigate = useNavigate();
  const toast = useToast();
  const { backendUser, isAuthenticated } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [conversation, setConversation] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [maxQuestions] = useState(10);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [error, setError] = useState(null);
  const [userResumes, setUserResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const aiBg = useColorModeValue("blue.50", "blue.900");
  const userBg = useColorModeValue("green.50", "green.900");

  const conversationEndRef = useRef(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Load user resumes and initialize interview
  useEffect(() => {
    if (isAuthenticated) {
      initializeInterview();
    }
  }, [isAuthenticated]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const initializeInterview = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load user resumes
      if (backendUser?.id) {
        const resumesResponse = await resumeAPI.getUserResumes(backendUser.id);
        if (resumesResponse.status === "success" && resumesResponse.data?.length > 0) {
          setUserResumes(resumesResponse.data);
          setSelectedResume(resumesResponse.data[0]); // Use first resume
        }
      }

      // Create interview session
      const sessionResponse = await interviewAPI.createSession({
        user_id: backendUser?.id,
        session_name: `AI Interview - ${new Date().toLocaleDateString()}`,
        session_type: "ai_interview",
        max_questions: maxQuestions,
      });

      if (sessionResponse.status === "success") {
        setSessionId(sessionResponse.data.id);
        
        // Start with first AI question
        await generateNextQuestion();
      } else {
        throw new Error("Failed to create interview session");
      }
    } catch (err) {
      const errorInfo = apiUtils.handleError(err);
      setError(errorInfo.message);
      console.error("Error initializing interview:", errorInfo);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNextQuestion = async () => {
    try {
      setIsTyping(true);
      
      // Prepare context for Gemini
      const context = selectedResume ? 
        `Based on this resume: ${JSON.stringify(selectedResume.analysis || {})}` : 
        "Generate a general interview question";

      const prompt = `
        You are an AI interviewer conducting a professional interview. 
        ${context}
        
        Previous questions asked: ${conversation.filter(msg => msg.type === 'ai').map(msg => msg.content).join(', ')}
        
        Generate the next interview question that:
        1. Is relevant to the candidate's background
        2. Tests their skills and experience
        3. Is different from previous questions
        4. Is appropriate for their experience level
        5. Can be answered in 2-3 minutes
        
        Return only the question text, no additional formatting.
      `;

      const response = await geminiAPI.askQuestion(prompt, context);

      if (response.status === "success") {
        const question = response.data.response || response.data.answer;
        setCurrentQuestion(question);
        
        // Add AI question to conversation
        setConversation(prev => [
          ...prev,
          {
            type: 'ai',
            content: question,
            timestamp: new Date().toISOString(),
          }
        ]);
        
        setQuestionCount(prev => prev + 1);
      } else {
        throw new Error("Failed to generate question");
      }
    } catch (err) {
      const errorInfo = apiUtils.handleError(err);
      toast({
        title: "Failed to generate question",
        description: errorInfo.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsTyping(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Please provide an answer",
        description: "Type your answer before submitting",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsEvaluating(true);

      // Add user answer to conversation
      setConversation(prev => [
        ...prev,
        {
          type: 'user',
          content: userAnswer,
          timestamp: new Date().toISOString(),
        }
      ]);

      // Evaluate answer with Gemini
      const evaluationPrompt = `
        Evaluate this interview answer:
        
        Question: ${currentQuestion}
        Answer: ${userAnswer}
        
        Provide evaluation in this JSON format:
        {
          "score": number (1-10),
          "feedback": "detailed feedback",
          "strengths": ["strength1", "strength2"],
          "improvements": ["improvement1", "improvement2"],
          "follow_up": "suggested follow-up question or none"
        }
      `;

      const evaluationResponse = await geminiAPI.askQuestion(evaluationPrompt);
      
      let evaluation = null;
      if (evaluationResponse.status === "success") {
        try {
          evaluation = JSON.parse(evaluationResponse.data.response || evaluationResponse.data.answer);
        } catch (parseError) {
          // Fallback if JSON parsing fails
          evaluation = {
            score: 7,
            feedback: evaluationResponse.data.response || evaluationResponse.data.answer,
            strengths: ["Good attempt"],
            improvements: ["Could be more specific"],
            follow_up: null
          };
        }
      }

      // Submit to backend
      if (sessionId) {
        await interviewAPI.submitAnswer(
          sessionId,
          questionCount - 1,
          userAnswer,
          selectedResume?.analysis ? JSON.stringify(selectedResume.analysis) : null
        );
      }

      // Add evaluation to conversation
      if (evaluation) {
        setConversation(prev => [
          ...prev,
          {
            type: 'evaluation',
            content: evaluation,
            timestamp: new Date().toISOString(),
          }
        ]);
      }

      // Check if interview should continue
      if (questionCount >= maxQuestions) {
        await completeInterview();
      } else {
        // Clear answer and prepare for next question
        setUserAnswer("");
        setTimeout(() => {
          generateNextQuestion();
        }, 2000); // Give time to read evaluation
      }

    } catch (err) {
      const errorInfo = apiUtils.handleError(err);
      toast({
        title: "Failed to submit answer",
        description: errorInfo.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const completeInterview = async () => {
    try {
      if (sessionId) {
        await interviewAPI.completeSession(sessionId);
      }
      setInterviewComplete(true);
      
      toast({
        title: "AI Interview completed! 🎉",
        description: "Great job! Check your detailed feedback.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error completing interview:", err);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 6) return "yellow";
    return "red";
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" />
          <Text>Initializing AI Interview...</Text>
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
          onClick={initializeInterview}
          leftIcon={<FaArrowLeft />}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  if (interviewComplete) {
    const aiMessages = conversation.filter(msg => msg.type === 'ai');
    const evaluations = conversation.filter(msg => msg.type === 'evaluation');
    const averageScore = evaluations.length > 0 
      ? (evaluations.reduce((sum, e) => sum + e.content.score, 0) / evaluations.length).toFixed(1)
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
                  AI Interview Complete! 🤖🎉
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
                      {aiMessages.length}
                    </Text>
                    <Text fontSize="sm" opacity={0.7}>Questions Asked</Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="bold" color="green.400">
                      {evaluations.filter(e => e.content.score >= 7).length}
                    </Text>
                    <Text fontSize="sm" opacity={0.7}>Strong Answers</Text>
                  </VStack>
                </HStack>
              </VStack>
            </CardHeader>
          </Card>

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
      maxW="900px"
      mx="auto"
      mt={8}
    >
      <VStack spacing={6}>
        {/* Header */}
        <Card bg={cardBg} w="100%">
          <CardBody>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Heading size="md" color={textColor}>
                  AI Interview Session
                </Heading>
                <Text fontSize="sm" opacity={0.7}>
                  Powered by Gemini AI
          </Text>
              </VStack>
              <HStack spacing={4}>
                <Badge colorScheme="blue" variant="solid">
                  Question {questionCount}/{maxQuestions}
                </Badge>
                <Progress
                  value={(questionCount / maxQuestions) * 100}
                  w="100px"
                  colorScheme="teal"
                  borderRadius="full"
                  size="sm"
                />
              </HStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Conversation */}
        <Card bg={cardBg} w="100%" maxH="500px" overflowY="auto">
          <CardBody>
            <VStack spacing={4} align="stretch">
              {conversation.map((message, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.type === 'ai' && (
                    <Flex justify="start">
                      <HStack spacing={3} maxW="80%">
                        <Avatar size="sm" bg="blue.500" icon={<FaRobot />} />
                        <Card bg={aiBg} border="1px solid" borderColor="blue.200">
                          <CardBody p={3}>
                            <Text fontSize="sm">{message.content}</Text>
                          </CardBody>
                        </Card>
                      </HStack>
                    </Flex>
                  )}

                  {message.type === 'user' && (
                    <Flex justify="end">
                      <HStack spacing={3} maxW="80%">
                        <Card bg={userBg} border="1px solid" borderColor="green.200">
                          <CardBody p={3}>
                            <Text fontSize="sm">{message.content}</Text>
                          </CardBody>
                        </Card>
                        <Avatar size="sm" bg="green.500" icon={<FaUser />} />
                      </HStack>
                    </Flex>
                  )}

                  {message.type === 'evaluation' && (
                    <Card bg="purple.50" _dark={{ bg: "purple.900" }} border="1px solid" borderColor="purple.200" _dark={{ borderColor: "purple.700" }}>
                      <CardBody p={3}>
                        <VStack spacing={2} align="stretch">
                          <HStack justify="space-between">
                            <Text fontSize="sm" fontWeight="bold" color="purple.600" _dark={{ color: "purple.300" }}>
                              AI Evaluation
                            </Text>
                            <Badge colorScheme={getScoreColor(message.content.score)} variant="solid">
                              {message.content.score}/10
                            </Badge>
                          </HStack>
                          <Text fontSize="sm">{message.content.feedback}</Text>
                          
                          {message.content.strengths && message.content.strengths.length > 0 && (
                            <HStack spacing={2} wrap="wrap">
                              <Text fontSize="xs" fontWeight="medium" color="green.600" _dark={{ color: "green.300" }}>
                                Strengths:
          </Text>
                              {message.content.strengths.map((strength, i) => (
                                <Badge key={i} colorScheme="green" variant="subtle" fontSize="xs">
                                  {strength}
                                </Badge>
                              ))}
                            </HStack>
                          )}
                          
                          {message.content.improvements && message.content.improvements.length > 0 && (
                            <HStack spacing={2} wrap="wrap">
                              <Text fontSize="xs" fontWeight="medium" color="orange.600" _dark={{ color: "orange.300" }}>
                                Improvements:
          </Text>
                              {message.content.improvements.map((improvement, i) => (
                                <Badge key={i} colorScheme="orange" variant="subtle" fontSize="xs">
                                  {improvement}
                                </Badge>
                              ))}
                            </HStack>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </MotionBox>
              ))}
              
              {isTyping && (
                <Flex justify="start">
                  <HStack spacing={3}>
                    <Avatar size="sm" bg="blue.500" icon={<FaRobot />} />
                    <Card bg={aiBg} border="1px solid" borderColor="blue.200">
                      <CardBody p={3}>
                        <HStack spacing={2}>
                          <Spinner size="sm" />
                          <Text fontSize="sm">AI is thinking...</Text>
                        </HStack>
                      </CardBody>
                    </Card>
                  </HStack>
                </Flex>
              )}
              
              <div ref={conversationEndRef} />
            </VStack>
          </CardBody>
        </Card>

        {/* Answer Input */}
        {currentQuestion && !isTyping && (
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            bg={cardBg}
            w="100%"
            border="1px solid"
            borderColor={borderColor}
          >
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Textarea
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  size="lg"
            minH="150px"
                  resize="vertical"
                  _focus={{ borderColor: "teal.400" }}
                />

                <HStack justify="space-between">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    leftIcon={<FaArrowLeft />}
                    isDisabled={isEvaluating}
                  >
                    Exit Interview
                  </Button>

          <Button
                    colorScheme="teal"
                    onClick={submitAnswer}
                    isLoading={isEvaluating}
                    loadingText="Evaluating..."
                    rightIcon={<FaCheck />}
                    isDisabled={!userAnswer.trim()}
                  >
                    Submit Answer
          </Button>
                </HStack>
              </VStack>
            </CardBody>
          </MotionCard>
        )}
        </VStack>
    </MotionBox>
  );
}