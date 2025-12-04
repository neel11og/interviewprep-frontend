// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  HStack,
  useToast,
  Avatar,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { resumeAPI, apiUtils } from "../services/api";
import ResumeUpload from "../components/ResumeUpload";

const MotionBox = motion(Box);

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, backendUser, isAuthenticated, loading: authLoading } = useAuth();
  
  const [userResumes, setUserResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Theme-aware colors
  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(26, 32, 44, 0.7)");
  const sectionBg = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const cardBg = useColorModeValue("white", "gray.800");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
        navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load user resumes
  useEffect(() => {
    if (backendUser?.id) {
      loadUserResumes();
    }
  }, [backendUser]);

  const loadUserResumes = async () => {
    try {
      setLoading(true);
      const response = await resumeAPI.getUserResumes(backendUser.id);
      setUserResumes(response.data || []);
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      setError(errorInfo.message);
      console.error("Failed to load resumes:", errorInfo);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUploaded = () => {
    // Reload resumes after upload
    loadUserResumes();
    toast({
      title: "Resume uploaded successfully! 🎉",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleStartInterview = () => {
    if (userResumes.length === 0) {
      toast({
        title: "Please upload a resume first",
        description: "You need to upload a resume to start an AI interview",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    navigate("/interview");
  };

  const handleStartAIInterview = () => {
    if (userResumes.length === 0) {
      toast({
        title: "Please upload a resume first",
        description: "You need to upload a resume to start an AI interview",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    navigate("/ai-interview");
  };

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" />
          <Text>Loading your dashboard...</Text>
        </VStack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      maxW="1200px"
      mx="auto"
      mt={8}
      p={8}
      bg={glassBg}
      borderRadius="xl"
      boxShadow="2xl"
      color={textColor}
      backdropFilter="blur(10px)"
    >
      <VStack spacing={8} align="stretch">
        {/* Profile Header */}
        <MotionBox
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <HStack spacing={6} align="center">
            <Avatar
              size="xl"
              name={backendUser?.full_name || user?.displayName || "User"}
              src={user?.photoURL || ""}
              border="3px solid"
              borderColor="teal.400"
            />
            <VStack align="start" spacing={2}>
              <Heading size="lg" color="teal.300">
                Welcome back, {backendUser?.full_name || user?.displayName || "User"}!
              </Heading>
              <Text fontSize="lg" opacity={0.8}>
                {backendUser?.email || user?.email}
              </Text>
              <Badge colorScheme="blue" variant="subtle">
                {backendUser?.role || "candidate"}
              </Badge>
          </VStack>
        </HStack>
        </MotionBox>

        <Divider />

        {/* Error Alert */}
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Resumes Uploaded</StatLabel>
                  <StatNumber color="teal.400">{userResumes.length}</StatNumber>
                  <StatHelpText>
                    {userResumes.length > 0 ? "Ready for interviews" : "Upload your first resume"}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
              <Stat>
                  <StatLabel>Profile Completion</StatLabel>
                  <StatNumber color="blue.400">
                    {backendUser ? 
                      Math.round(
                        (backendUser.email ? 25 : 0) +
                        (backendUser.full_name ? 25 : 0) +
                        (userResumes.length > 0 ? 25 : 0) +
                        (backendUser.interview_completed ? 25 : 0)
                      )
                      : 0}%
                </StatNumber>
                <StatHelpText>
                    <Progress
                      value={backendUser ? 
                        (backendUser.email ? 25 : 0) +
                        (backendUser.full_name ? 25 : 0) +
                        (userResumes.length > 0 ? 25 : 0) +
                        (backendUser.interview_completed ? 25 : 0)
                        : 0}
                      size="sm"
                      colorScheme="blue"
                      borderRadius="full"
                    />
                </StatHelpText>
              </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
              <Stat>
                  <StatLabel>Account Status</StatLabel>
                  <StatNumber color="green.400">
                    {backendUser?.is_active ? "Active" : "Inactive"}
                </StatNumber>
                  <StatHelpText>
                    {backendUser?.is_verified ? "Verified" : "Not verified"}
                </StatHelpText>
              </Stat>
              </CardBody>
            </Card>
            </SimpleGrid>
        </MotionBox>

        <Divider />

        {/* Resume Upload Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Upload Your Resume</Heading>
              <Text fontSize="sm" opacity={0.7}>
                Upload your resume to get personalized interview questions and AI analysis
              </Text>
            </CardHeader>
            <CardBody>
              <ResumeUpload onUploadSuccess={handleResumeUploaded} />
            </CardBody>
          </Card>
        </MotionBox>

        {/* Recent Resumes */}
        {userResumes.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card bg={cardBg}>
              <CardHeader>
                <Heading size="md">Your Resumes</Heading>
                <Text fontSize="sm" opacity={0.7}>
                  Manage your uploaded resumes and view analysis
                </Text>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {userResumes.map((resume, index) => (
                    <Box
                      key={resume.id || index}
                      p={4}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      bg="gray.50"
                      _dark={{ bg: "gray.700", borderColor: "gray.600" }}
                    >
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">{resume.filename}</Text>
                          <Text fontSize="sm" opacity={0.7}>
                            Uploaded: {new Date(resume.created_at).toLocaleDateString()}
                          </Text>
                          {resume.analysis && (
                            <Badge colorScheme="green" size="sm">
                              Analyzed
                            </Badge>
                          )}
                        </VStack>
                        <VStack spacing={2}>
                          <Text fontSize="sm" fontWeight="bold">
                            {resume.analysis?.role || "Role not detected"}
                          </Text>
                          <Text fontSize="xs" opacity={0.7}>
                            {resume.analysis?.experience_level || "Experience level not detected"}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
          </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        )}

        <Divider />

        {/* Action Buttons */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Card bg={cardBg}>
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md">Practice Interview</Heading>
                  <Text textAlign="center" opacity={0.7}>
                    Take a practice interview with random questions
                  </Text>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleStartInterview}
                    isDisabled={loading}
                    isLoading={loading}
                    w="full"
                  >
                    Start Practice Interview
                  </Button>
          </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md">AI Interview</Heading>
                  <Text textAlign="center" opacity={0.7}>
                    Experience an AI-powered interview based on your resume
                  </Text>
          <Button
            colorScheme="teal"
            size="lg"
                    onClick={handleStartAIInterview}
                    isDisabled={loading || userResumes.length === 0}
                    isLoading={loading}
                    w="full"
          >
            Start AI Interview
          </Button>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </MotionBox>

        {/* Quick Actions */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <HStack justify="space-between" align="center" p={4} bg={sectionBg} borderRadius="md">
            <VStack align="start">
              <Heading size="md">Need Help?</Heading>
              <Text>Check out our guides and tips for interview success</Text>
            </VStack>
            <HStack spacing={4}>
              <Button variant="outline" onClick={() => navigate("/feedback")}>
                View Feedback
              </Button>
              <Button colorScheme="purple" variant="outline">
                Interview Tips
          </Button>
        </HStack>
          </HStack>
        </MotionBox>
      </VStack>
    </MotionBox>
  );
}