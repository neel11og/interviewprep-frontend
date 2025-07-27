import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  useColorModeValue,
  VStack,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Divider,
} from "@chakra-ui/react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

// --- FIXED IMAGE IMPORTS ---
// This path correctly goes up one level from 'src/pages' to 'src',
// and then into the 'assets' folder.
import card1Image from "/card1.png";
import card2Image from '/card2.png';
import card3Image from '/card3.png';



const cardData = [
  {
    id: 1,
    background: card1Image ,
    title: "Practice Interviews",
    description: "Prepare with precision using questions derived from your own experience. Our AI platform analyzes your resume to generate a bespoke set of technical, behavioral, and situational inquiries, ensuring your practice is 100% relevant.",
  },
  {
    id: 2,
    background: card2Image,
    title: "Real-time AI Interviewer",
    description: "Master your interview presence with on-demand AI simulations. Practice your pacing, articulation, and responses in a realistic environment designed to mimic a true-to-life hiring manager interaction.",
  },
  {
    id: 3,
    background: card3Image,
    title: "Feedback & Scoring",
    description: "The key to improvement is measurable feedback. Our system analyzes each response to provide a quantitative score and strategic advice, turning every practice session into a targeted lesson for growth.",
  },
];

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const color = useColorModeValue("gray.800", "whiteAlpha.900");
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box position="relative" minH="100vh" overflow="hidden">
      <Box
        borderRadius="xl"
        position="relative"
        bg={useColorModeValue("rgba(255, 255, 255, 0.2)","rgba(0, 0, 0, 0.5)")}
        boxShadow="lg"
        px={[4, 8]}
        py={[8, 16]}
        minH="100vh"
      >
      <VStack spacing={8} px={6} pt={32} textAlign="center">
        
        <Heading fontSize="4xl" color={color}>
          Welcome to the Future of Interview Preparation
        </Heading>
        <Text fontSize="lg" color={color} maxW="600px">
          InterviewPrep.AI is your smart assistant for mastering job interviews. Upload your resume,
          receive custom questions, and experience real-time AI interviews with meaningful feedback.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mt={10} w="100%" maxW="1200px">
          {cardData.map((card, index) => (
            <Box
              key={index}
              p={6}
              bgImage={`url(${card.background})`}
              bgSize="cover"
              bgPosition="center"
              color="white"
              borderRadius="2xl"
              boxShadow="lg"
              transition="all 0.3s ease"
              minHeight="400px"
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bg: 'linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent 60%)',
                borderRadius: '2xl',
                zIndex: 1,
              }}
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "2xl",
              }}
            >
              <Box position="relative" zIndex={2}>
                <Heading size="md" mb={3}>
                  {card.title}
                </Heading>
                <Text fontSize="md">{card.description}</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        <Text fontSize="md" color={color} maxW="800px" mt={8}>
          Start building confidence and preparing smartly with InterviewPrep.AI — the platform that adapts to your career goals and resume.
        </Text>
      </VStack>
      </Box>

      {/* Sign-in Button */}
      <Box position="fixed" bottom="30px" right="30px">
        <Button
          onClick={onOpen}
          borderRadius="full"
          bg="teal.400"
          color="white"
          px={6}
          py={4}
          size="lg"
          fontWeight="bold"
          _hover={{ bg: "teal.500", transform: "scale(1.05)" }}
        >
          Sign In / Log In
        </Button>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent bg={bg} color={color} borderRadius="2xl" boxShadow="xl">
          <ModalHeader>Welcome Back</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input placeholder="Email" variant="filled" />
              <Input placeholder="Password" type="password" variant="filled" />
              <Button colorScheme="teal" w="100%" borderRadius="full">
                Sign In with Credentials
              </Button>
              <Divider />
              <Button
                leftIcon={<FaGoogle />}
                w="100%"
                borderRadius="full"
                variant="outline"
                _hover={{ bg: "gray.100", color: "black" }}
              >
                Continue with Google
              </Button>
              <Button
                leftIcon={<FaFacebookF />}
                w="100%"
                borderRadius="full"
                variant="outline"
                _hover={{ bg: "blue.100", color: "black" }}
              >
                Continue with Facebook / Meta
              </Button>
            </VStack>
            
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} borderRadius="full">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;