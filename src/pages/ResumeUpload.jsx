// src/pages/ResumeUpload.jsx
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
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected.",
        description: "Please select a PDF resume to upload.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        toast({
          title: "Resume uploaded successfully.",
          description: "Generating interview questions based on your resume...",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Redirect to Interview page
        navigate("/interview");
      }
    } catch (err) {
      toast({
        title: "Upload failed.",
        description: err.response?.data?.detail || "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgGradient="linear(to-br, blue.500, purple.500)"
      color="white"
    >
      <VStack
        spacing={5}
        bg="rgba(0,0,0,0.5)"
        p={8}
        borderRadius="lg"
        boxShadow="xl"
      >
        <Text fontSize="2xl" fontWeight="bold">
          Upload Your Resume
        </Text>
        <Input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          bg="white"
          color="black"
          p={1}
          borderRadius="md"
        />
        <Button
          colorScheme="teal"
          onClick={handleUpload}
          isDisabled={loading}
          size="lg"
        >
          {loading ? <Spinner size="sm" /> : "Upload & Start Interview"}
        </Button>
      </VStack>
    </Box>
  );
}