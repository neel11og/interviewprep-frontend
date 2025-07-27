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
  Icon,
  HStack
} from '@chakra-ui/react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useRef } from 'react';

export default function AuthModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

  const modalBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.800');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const shadow = useColorModeValue('xl', 'dark-lg');

  return (
    <>
      <Button
        ref={btnRef}
        onClick={onOpen}
        variant="ghost"
        colorScheme="teal"
        rounded="full"
        px={6}
        fontWeight="bold"
        _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
      >
        Sign In / Login
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
        <ModalOverlay />
        <ModalContent
          bg={modalBg}
          rounded="2xl"
          boxShadow={shadow}
          px={4}
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
                    <Input placeholder="Name" bg={inputBg} rounded="xl" />
                    <Input placeholder="Email" type="email" bg={inputBg} rounded="xl" />
                    <Input placeholder="Password" type="password" bg={inputBg} rounded="xl" />
                    <Button colorScheme="teal" w="full" rounded="full">
                      Create Account
                    </Button>
                  </VStack>
                  <Text mt={4} textAlign="center" fontSize="sm" color="gray.500">
                    or sign up with
                  </Text>
                  <HStack justify="center" mt={2}>
                    <Button leftIcon={<FaGoogle />} variant="outline" rounded="full">
                      Google
                    </Button>
                    <Button leftIcon={<FaFacebookF />} variant="outline" rounded="full">
                      Facebook
                    </Button>
                  </HStack>
                </TabPanel>

                {/* Login Tab */}
                <TabPanel>
                  <VStack spacing={4}>
                    <Input placeholder="Email" type="email" bg={inputBg} rounded="xl" />
                    <Input placeholder="Password" type="password" bg={inputBg} rounded="xl" />
                    <Button colorScheme="teal" w="full" rounded="full">
                      Login
                    </Button>
                  </VStack>
                  <Text mt={4} textAlign="center" fontSize="sm" color="gray.500">
                    or login with
                  </Text>
                  <HStack justify="center" mt={2}>
                    <Button leftIcon={<FaGoogle />} variant="outline" rounded="full">
                      Google
                    </Button>
                    <Button leftIcon={<FaFacebookF />} variant="outline" rounded="full">
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
    </>
  );
}
