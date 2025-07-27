import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected.",
        description: "Please choose a resume PDF to upload.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://localhost:8000/upload_resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Resume uploaded!",
          description: `Detected role: ${data.role}`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        // TODO: Redirect to AI Interview phase or update global state
        // Example: navigate("/interview-phase-one");
      } else {
        throw new Error(data.detail || "Resume parsing failed");
      }
    } catch (err) {
      toast({
        title: "Upload failed.",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      p={6}
      bg="whiteAlpha.100"
      borderRadius="xl"
      boxShadow="lg"
      backdropFilter="blur(10px)"
      w={{ base: "100%", md: "500px" }}
      mx="auto"
      mt={10}
    >
      <VStack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          Upload Your Resume (PDF)
        </Text>

        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          borderRadius="md"
          p={2}
          bg="whiteAlpha.200"
          color="white"
          _hover={{ bg: "whiteAlpha.300" }}
        />

        <Button
          leftIcon={isUploading ? <Spinner size="sm" /> : <FaUpload />}
          onClick={handleUpload}
          colorScheme="teal"
          w="100%"
          borderRadius="full"
          isDisabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload & Detect Role"}
        </Button>
      </VStack>
    </Box>
  );
};

export default ResumeUpload;
