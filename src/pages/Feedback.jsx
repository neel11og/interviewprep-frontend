// src/pages/Feedback.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
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
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  List,
  ListItem,
  ListIcon,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, 
  FaCheck, 
  FaStar, 
  FaThumbsUp, 
  FaLightbulb, 
  FaChartLine,
  FaUser,
  FaRobot,
  FaClock,
  FaTrophy,
  FaExclamationTriangle,
  FaInfoCircle
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { interviewAPI, apiUtils } from "../services/api";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function Feedback() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const { backendUser, isAuthenticated } = useAuth();

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Get session ID from URL params or use latest session
  useEffect(() => {
    if (isAuthenticated) {
      const urlSessionId = searchParams.get('session_id');
      if (urlSessionId) {
        setSessionId(urlSessionId);
        loadFeedback(urlSessionId);
      } else {
        // Load latest session feedback
        loadLatestFeedback();
      }
    }
  }, [isAuthenticated, searchParams]);

  const loadFeedback = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await interviewAPI.getFeedback(sessionId);

      if (response.status === "success") {
        setFeedback(response.data);
      } else {
        throw new Error(response.message || "Failed to load feedback");
      }
    } catch (err) {
      const errorInfo = apiUtils.handleError(err);
      setError(errorInfo.message);
      console.error("Error loading feedback:", errorInfo);
    } finally {
      setLoading(false);
    }
  };

  const loadLatestFeedback = async () => {
    try {
      setLoading(true);
      setError(null);

      // This would typically come from a user sessions API
      // For now, we'll show a message to upload a resume and take an interview
      setError("No interview sessions found. Please complete an interview first.");
    } catch (err) {
      const errorInfo = apiUtils.handleError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 6) return "yellow";
    return "red";
  };

  const getScoreIcon = (score) => {
    if (score >= 8) return FaTrophy;
    if (score >= 6) return FaThumbsUp;
    return FaExclamationTriangle;
  };

  const getPerformanceLevel = (averageScore) => {
    if (averageScore >= 8) return "Excellent";
    if (averageScore >= 6) return "Good";
    if (averageScore >= 4) return "Fair";
    return "Needs Improvement";
  };

  const getPerformanceColor = (averageScore) => {
    if (averageScore >= 8) return "green";
    if (averageScore >= 6) return "blue";
    if (averageScore >= 4) return "yellow";
    return "red";
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" />
          <Text>Loading your feedback...</Text>
        </VStack>
      </Box>
    );
  }

  if (error && !feedback) {
    return (
      <Box maxW="600px" mx="auto" mt={8}>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <AlertTitle>No Interview Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <HStack spacing={4} mt={6}>
          <Button
            colorScheme="blue"
            onClick={() => navigate("/dashboard")}
            leftIcon={<FaArrowLeft />}
          >
            Back to Dashboard
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => navigate("/interview")}
            rightIcon={<FaCheck />}
          >
            Start Practice Interview
          </Button>
        </HStack>
      </Box>
    );
  }

  if (!feedback) {
    return (
      <Box maxW="600px" mx="auto" mt={8}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <AlertTitle>No Feedback Available</AlertTitle>
          <AlertDescription>
            Complete an interview to see your detailed feedback and analysis.
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  const averageScore = feedback.answers?.length > 0 
    ? feedback.answers.reduce((sum, answer) => sum + answer.score, 0) / feedback.answers.length
    : 0;

  const strongAnswers = feedback.answers?.filter(answer => answer.score >= 7).length || 0;
  const totalQuestions = feedback.answers?.length || 0;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      maxW="1000px"
      mx="auto"
      mt={8}
    >
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          bg={cardBg}
          w="100%"
        >
          <CardHeader textAlign="center">
            <VStack spacing={4}>
              <Heading size="lg" color="teal.400">
                Interview Feedback Report
        </Heading>
              <Text fontSize="sm" opacity={0.7}>
                Session completed on {new Date(feedback.completed_at).toLocaleDateString()}
        </Text>
            </VStack>
          </CardHeader>
        </MotionCard>

        {/* Overall Performance Stats */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          bg={cardBg}
          w="100%"
        >
          <CardHeader>
            <Heading size="md" color={textColor}>
              Overall Performance
            </Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
              <Stat textAlign="center">
                <StatLabel>Average Score</StatLabel>
                <StatNumber color={`${getScoreColor(averageScore)}.400`}>
                  {averageScore.toFixed(1)}/10
                </StatNumber>
                <StatHelpText>
                  <Badge colorScheme={getPerformanceColor(averageScore)} variant="solid">
                    {getPerformanceLevel(averageScore)}
                  </Badge>
                </StatHelpText>
              </Stat>

              <Stat textAlign="center">
                <StatLabel>Questions Answered</StatLabel>
                <StatNumber color="blue.400">
                  {totalQuestions}
                </StatNumber>
                <StatHelpText>
                  <Icon as={FaCheck} color="green.400" />
                  {" "}All completed
                </StatHelpText>
              </Stat>

              <Stat textAlign="center">
                <StatLabel>Strong Answers</StatLabel>
                <StatNumber color="green.400">
                  {strongAnswers}
                </StatNumber>
                <StatHelpText>
                  Score ≥ 7/10
                </StatHelpText>
              </Stat>

              <Stat textAlign="center">
                <StatLabel>Performance</StatLabel>
                <StatNumber color="purple.400">
                  {totalQuestions > 0 ? Math.round((strongAnswers / totalQuestions) * 100) : 0}%
                </StatNumber>
                <StatHelpText>
                  Strong answers ratio
                </StatHelpText>
              </Stat>
            </SimpleGrid>
          </CardBody>
        </MotionCard>

        {/* Detailed Question Analysis */}
        {feedback.answers && feedback.answers.length > 0 && (
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            bg={cardBg}
            w="100%"
          >
            <CardHeader>
              <Heading size="md" color={textColor}>
                Question-by-Question Analysis
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                {feedback.answers.map((answer, index) => (
                  <MotionCard
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    bg="gray.50"
                    _dark={{ bg: "gray.700" }}
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
                            <Text fontSize="sm" opacity={0.8}>
                              {answer.question}
                            </Text>
                          </VStack>
                          <HStack spacing={2}>
                            <Badge colorScheme={getScoreColor(answer.score)} variant="solid">
                              <Icon as={getScoreIcon(answer.score)} mr={1} />
                              {answer.score}/10
                            </Badge>
                            <Badge colorScheme="blue" variant="outline">
                              {answer.level || "Professional"}
                            </Badge>
                          </HStack>
                        </HStack>

                        <Divider />

                        <VStack align="start" spacing={3}>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium" color="blue.400">
                              Your Answer:
                            </Text>
                            <Text fontSize="sm" opacity={0.8}>
                              {answer.answer}
                            </Text>
                          </VStack>

                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium" color="purple.400">
                              AI Feedback:
                            </Text>
                            <Text fontSize="sm">
                              {answer.feedback || "No specific feedback provided."}
                            </Text>
                          </VStack>

                          {answer.strengths && answer.strengths.length > 0 && (
                            <VStack align="start" spacing={2}>
                              <Text fontWeight="medium" color="green.400">
                                <Icon as={FaThumbsUp} mr={2} />
                                Strengths:
                              </Text>
                              <List spacing={1}>
                                {answer.strengths.map((strength, i) => (
                                  <ListItem key={i} fontSize="sm">
                                    <ListIcon as={FaCheck} color="green.400" />
                                    {strength}
                                  </ListItem>
                                ))}
                              </List>
                            </VStack>
                          )}

                          {answer.improvements && answer.improvements.length > 0 && (
                            <VStack align="start" spacing={2}>
                              <Text fontWeight="medium" color="orange.400">
                                <Icon as={FaLightbulb} mr={2} />
                                Areas for Improvement:
                              </Text>
                              <List spacing={1}>
                                {answer.improvements.map((improvement, i) => (
                                  <ListItem key={i} fontSize="sm">
                                    <ListIcon as={FaExclamationTriangle} color="orange.400" />
                                    {improvement}
                                  </ListItem>
                                ))}
                              </List>
                            </VStack>
                          )}
                        </VStack>
                      </VStack>
                    </CardBody>
                  </MotionCard>
                ))}
              </VStack>
            </CardBody>
          </MotionCard>
        )}

        {/* Recommendations */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          bg={cardBg}
          w="100%"
        >
          <CardHeader>
            <Heading size="md" color={textColor}>
              <Icon as={FaChartLine} mr={2} />
              Recommendations for Improvement
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {averageScore < 6 && (
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <AlertTitle>Focus Areas</AlertTitle>
                  <AlertDescription>
                    Consider practicing more interview questions and improving your communication skills.
                  </AlertDescription>
                </Alert>
              )}

              {averageScore >= 6 && averageScore < 8 && (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <AlertTitle>Good Progress</AlertTitle>
                  <AlertDescription>
                    You're doing well! Focus on consistency and expanding your examples.
                  </AlertDescription>
                </Alert>
              )}

              {averageScore >= 8 && (
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <AlertTitle>Excellent Performance</AlertTitle>
                  <AlertDescription>
                    Outstanding work! Keep up the great performance in your interviews.
                  </AlertDescription>
                </Alert>
              )}

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Card bg="blue.50" _dark={{ bg: "blue.900" }} border="1px solid" borderColor="blue.200" _dark={{ borderColor: "blue.700" }}>
                  <CardBody>
                    <VStack spacing={2} align="start">
                      <Text fontWeight="bold" color="blue.600" _dark={{ color: "blue.300" }}>
                        Practice More
                      </Text>
                      <Text fontSize="sm">
                        Take more practice interviews to improve your confidence and consistency.
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg="green.50" _dark={{ bg: "green.900" }} border="1px solid" borderColor="green.200" _dark={{ borderColor: "green.700" }}>
                  <CardBody>
                    <VStack spacing={2} align="start">
                      <Text fontWeight="bold" color="green.600" _dark={{ color: "green.300" }}>
                        Study Your Field
                      </Text>
                      <Text fontSize="sm">
                        Review industry-specific questions and stay updated with latest trends.
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </MotionCard>

        {/* Action Buttons */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <HStack spacing={4} justify="center">
            <Button
              colorScheme="blue"
              onClick={() => navigate("/dashboard")}
              leftIcon={<FaArrowLeft />}
              size="lg"
            >
              Back to Dashboard
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => navigate("/interview")}
              rightIcon={<FaCheck />}
              size="lg"
            >
              Practice Again
            </Button>
            <Button
              colorScheme="purple"
              onClick={() => navigate("/ai-interview")}
              rightIcon={<FaRobot />}
              size="lg"
            >
              Try AI Interview
        </Button>
          </HStack>
        </MotionBox>
      </VStack>
    </MotionBox>
  );
}