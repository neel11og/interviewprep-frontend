// src/components/ResumeUpload.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  useToast,
  Spinner,
  Progress,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FaUpload, FaFilePdf, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { resumeAPI, apiUtils } from "../services/api";

const MotionBox = motion(Box);

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const toast = useToast();
  const { backendUser } = useAuth();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file) => {
    setError(null);
    setUploadResult(null);

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    setFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please choose a resume PDF to upload",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await resumeAPI.uploadResume(file, backendUser?.id);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.status === "success") {
        setUploadResult(response.data);
        
        toast({
          title: "Resume uploaded successfully! 🎉",
          description: `Role detected: ${response.data.resume_analysis?.role || "Professional"}`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        // Call success callback if provided
        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }

        // Reset form after successful upload
        setTimeout(() => {
          setFile(null);
          setUploadResult(null);
          setUploadProgress(0);
        }, 3000);
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (err) {
      const errorInfo = apiUtils.handleError(err);
      setError(errorInfo.message);
      
      toast({
        title: "Upload failed",
        description: errorInfo.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card bg={cardBg} boxShadow="lg">
        <CardHeader>
          <HStack spacing={3}>
            <FaFilePdf size="24px" color="#e53e3e" />
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                Upload Your Resume
              </Text>
              <Text fontSize="sm" opacity={0.7}>
                Upload a PDF resume to get personalized interview questions
              </Text>
            </VStack>
          </HStack>
        </CardHeader>
        
        <CardBody>
          <VStack spacing={6}>
            {/* File Upload Area */}
            <Box
              w="100%"
              p={8}
              border="2px dashed"
              borderColor={dragActive ? "teal.400" : borderColor}
      borderRadius="xl"
              bg={dragActive ? "teal.50" : "gray.50"}
              _dark={{ bg: dragActive ? "teal.900" : "gray.700" }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ borderColor: "teal.400", bg: "teal.50" }}
              _dark={{ _hover: { bg: "teal.900" } }}
    >
      <VStack spacing={4}>
                <FaUpload size="48px" color="#4fd1c7" />
                <VStack spacing={2}>
                  <Text fontWeight="bold" fontSize="lg">
                    {dragActive ? "Drop your resume here" : "Drag & drop your resume"}
                  </Text>
                  <Text fontSize="sm" opacity={0.7}>
                    or click to browse files
        </Text>
                </VStack>

                <FormControl>
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
                    display="none"
                    id="resume-upload"
                  />
                  <FormLabel
                    htmlFor="resume-upload"
                    cursor="pointer"
                    bg="teal.500"
          color="white"
                    px={6}
                    py={2}
                    borderRadius="full"
                    _hover={{ bg: "teal.600" }}
                    transition="all 0.2s"
                  >
                    Choose File
                  </FormLabel>
                </FormControl>
                
                <Text fontSize="xs" opacity={0.6}>
                  PDF files only, max 5MB
                </Text>
              </VStack>
            </Box>

            {/* Error Display */}
            {error && (
              <Alert status="error" borderRadius="md" w="100%">
                <AlertIcon />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* File Info */}
            {file && (
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                w="100%"
              >
                <Card bg="green.50" _dark={{ bg: "green.900" }} border="1px solid" borderColor="green.200" _dark={{ borderColor: "green.700" }}>
                  <CardBody>
                    <HStack spacing={3}>
                      <FaCheckCircle color="#38a169" size="20px" />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontWeight="bold" fontSize="sm">
                          {file.name}
                        </Text>
                        <Text fontSize="xs" opacity={0.7}>
                          {formatFileSize(file.size)}
                        </Text>
                      </VStack>
                      <Badge colorScheme="green" variant="subtle">
                        Ready to upload
                      </Badge>
                    </HStack>
                  </CardBody>
                </Card>
              </MotionBox>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                w="100%"
              >
                <VStack spacing={3}>
                  <Text fontSize="sm" fontWeight="medium">
                    Uploading and analyzing resume...
                  </Text>
                  <Progress
                    value={uploadProgress}
                    size="lg"
                    colorScheme="teal"
                    borderRadius="full"
                    w="100%"
                    hasStripe
                    isAnimated
                  />
                  <Text fontSize="xs" opacity={0.7}>
                    {uploadProgress}% complete
                  </Text>
                </VStack>
              </MotionBox>
            )}

            {/* Upload Result */}
            {uploadResult && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                w="100%"
              >
                <Card bg="blue.50" _dark={{ bg: "blue.900" }} border="1px solid" borderColor="blue.200" _dark={{ borderColor: "blue.700" }}>
                  <CardHeader>
                    <HStack spacing={3}>
                      <FaCheckCircle color="#3182ce" size="24px" />
                      <Text fontWeight="bold" color="blue.600" _dark={{ color: "blue.300" }}>
                        Resume Analysis Complete!
                      </Text>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {uploadResult.resume_analysis && (
                        <>
                          <HStack justify="space-between">
                            <Text fontWeight="medium">Detected Role:</Text>
                            <Badge colorScheme="blue" variant="solid">
                              {uploadResult.resume_analysis.role}
                            </Badge>
                          </HStack>
                          
                          <HStack justify="space-between">
                            <Text fontWeight="medium">Experience Level:</Text>
                            <Badge colorScheme="green" variant="solid">
                              {uploadResult.resume_analysis.experience_level}
                            </Badge>
                          </HStack>
                          
                          <Divider />
                          
                          <VStack align="start" spacing={2}>
                            <Text fontWeight="medium">Key Skills:</Text>
                            <HStack spacing={2} wrap="wrap">
                              {uploadResult.resume_analysis.key_skills?.slice(0, 5).map((skill, index) => (
                                <Badge key={index} colorScheme="purple" variant="subtle">
                                  {skill}
                                </Badge>
                              ))}
                            </HStack>
                          </VStack>
                          
                          <VStack align="start" spacing={2}>
                            <Text fontWeight="medium">Technologies:</Text>
                            <HStack spacing={2} wrap="wrap">
                              {uploadResult.resume_analysis.technologies?.slice(0, 5).map((tech, index) => (
                                <Badge key={index} colorScheme="orange" variant="subtle">
                                  {tech}
                                </Badge>
                              ))}
                            </HStack>
                          </VStack>
                        </>
                      )}
                      
                      {uploadResult.questions && (
                        <>
                          <Divider />
                          <VStack align="start" spacing={2}>
                            <Text fontWeight="medium">Generated Questions:</Text>
                            <Text fontSize="sm" opacity={0.7}>
                              {uploadResult.questions.total_count} personalized questions ready
                            </Text>
                          </VStack>
                        </>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            )}

            {/* Upload Button */}
        <Button
          leftIcon={isUploading ? <Spinner size="sm" /> : <FaUpload />}
          onClick={handleUpload}
          colorScheme="teal"
              size="lg"
          w="100%"
          borderRadius="full"
              isDisabled={!file || isUploading}
              isLoading={isUploading}
              loadingText="Processing..."
        >
              {isUploading ? "Processing..." : "Upload & Analyze Resume"}
        </Button>
      </VStack>
        </CardBody>
      </Card>
    </MotionBox>
  );
};

export default ResumeUpload;
