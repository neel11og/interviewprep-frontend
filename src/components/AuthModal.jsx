// src/components/AuthModal.jsx
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  VStack,
  useDisclosure,
  useColorModeValue,
  Text,
  HStack,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useRef, useState } from "react";
import { auth } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import {
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";

export default function AuthModal({ isOpen, onClose }) {
  const btnRef = useRef(null);
  const toast = useToast();
  const { loginWithEmail, registerWithEmail } = useAuth();

  const modalBg = useColorModeValue("whiteAlpha.900", "blackAlpha.800");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const shadow = useColorModeValue("xl", "dark-lg");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Google Sign-In
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      toast({
        title: "Signed in with Google 🎉",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      toast({
        title: "Google sign-in failed",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Facebook Sign-In
  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      toast({
        title: "Signed in with Facebook 🎉",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      toast({
        title: "Facebook sign-in failed",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Signup
  const handleSignup = async () => {
    setErrors({});
    
    // Basic validation
    if (!name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters" });
      return;
    }

    try {
      setLoading(true);
      const result = await registerWithEmail({
        email: email.trim(),
        password,
        username: name.trim().toLowerCase().replace(/\s+/g, '_'),
        full_name: name.trim(),
        role: "candidate",
        is_active: true,
        is_verified: false,
      });

      if (result.success) {
        toast({
          title: "Account created 🎉",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        // Reset form
        setEmail("");
        setPassword("");
        setName("");
      } else {
        toast({
          title: "Signup failed",
          description: result.error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Signup failed",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Login
  const handleLogin = async () => {
    setErrors({});
    
    // Basic validation
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!password) {
      setErrors({ password: "Password is required" });
      return;
    }

    try {
      setLoading(true);
      const result = await loginWithEmail(email.trim(), password);

      if (result.success) {
        toast({
          title: "Logged in ✅",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        // Reset form
        setEmail("");
        setPassword("");
      } else {
        toast({
          title: "Login failed",
          description: result.error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Login failed",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
      <ModalOverlay />
      <ModalContent
        bg={modalBg}
        rounded="2xl"
        boxShadow={shadow}
        px={4}
        maxW="400px"
      >
        <ModalHeader textAlign="center">Welcome to InterviewPrep.AI</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs variant="soft-rounded" colorScheme="teal" isFitted>
            <TabList mb={4}>
              <Tab>Sign Up</Tab>
              <Tab>Login</Tab>
            </TabList>

            <TabPanels>
              {/* Sign Up Tab */}
              <TabPanel>
                <VStack spacing={4}>
                  <FormControl isInvalid={errors.name}>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      placeholder="Enter your full name"
                      bg={inputBg}
                      rounded="xl"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      bg={inputBg}
                      rounded="xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      bg={inputBg}
                      rounded="xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  
                  <Button
                    colorScheme="teal"
                    w="full"
                    rounded="full"
                    onClick={handleSignup}
                    isLoading={loading}
                    loadingText="Creating Account..."
                  >
                    Create Account
                  </Button>
                </VStack>
                <Text mt={4} textAlign="center" fontSize="sm" color="gray.500">
                  or sign up with
                </Text>
                <HStack justify="center" mt={2}>
                  <Button
                    leftIcon={<FaGoogle />}
                    variant="outline"
                    rounded="full"
                    onClick={handleGoogleLogin}
                    isLoading={loading}
                  >
                    Google
                  </Button>
                  <Button 
                    leftIcon={<FaFacebookF />} 
                    variant="outline" 
                    rounded="full"
                    onClick={handleFacebookLogin}
                    isLoading={loading}
                  >
                    Facebook
                  </Button>
                </HStack>
              </TabPanel>

              {/* Login Tab */}
              <TabPanel>
                <VStack spacing={4}>
                  <FormControl isInvalid={errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      bg={inputBg}
                      rounded="xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      bg={inputBg}
                      rounded="xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  
                  <Button
                    colorScheme="teal"
                    w="full"
                    rounded="full"
                    onClick={handleLogin}
                    isLoading={loading}
                    loadingText="Signing In..."
                  >
                    Login
                  </Button>
                </VStack>
                <Text mt={4} textAlign="center" fontSize="sm" color="gray.500">
                  or login with
                </Text>
                <HStack justify="center" mt={2}>
                  <Button
                    leftIcon={<FaGoogle />}
                    variant="outline"
                    rounded="full"
                    onClick={handleGoogleLogin}
                    isLoading={loading}
                  >
                    Google
                  </Button>
                  <Button 
                    leftIcon={<FaFacebookF />} 
                    variant="outline" 
                    rounded="full"
                    onClick={handleFacebookLogin}
                    isLoading={loading}
                  >
                    Facebook
                  </Button>
                </HStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} rounded="full">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}