// src/components/Layout.jsx
import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Link as RouterLink, Outlet } from "react-router-dom";
import logo from "../assets/logo.png";

<Image src={logo} alt="InterviewPrep.AI Logo" boxSize="40px" />

const Layout = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.800")}>
      {/* Navbar */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding={4}
        bg={useColorModeValue("white", "gray.900")}
        borderBottom="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        shadow="sm"
        position="sticky"
        top="0"
        zIndex="999"
      >
        <RouterLink to="/">
          <Box fontWeight="bold" fontSize="lg">
            InterviewPrep.AI
          </Box>
        </RouterLink>

        <Flex align="center" gap={2}>
          {/* Toggle Dark Mode */}
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            size="sm"
          />

          {/* Mobile Hamburger Menu */}
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            onClick={onOpen}
            display={{ base: "inline-flex", md: "none" }}
            size="sm"
          />
        </Flex>

        {/* Desktop Links */}
        <Flex
          direction="row"
          align="center"
          gap={6}
          display={{ base: "none", md: "flex" }}
        >
          <ChakraLink as={RouterLink} to="/interview">
            Interview
          </ChakraLink>
          <ChakraLink as={RouterLink} to="/feedback">
            Feedback
          </ChakraLink>
          <ChakraLink as={RouterLink} to="/ai-interview">
            AI Interview
          </ChakraLink>
        </Flex>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navigate</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <ChakraLink as={RouterLink} to="/interview" onClick={onClose}>
                Interview
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/feedback" onClick={onClose}>
                Feedback
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/ai-interview" onClick={onClose}>
                AI Interview
              </ChakraLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Outlet for child pages */}
      <Box p={{ base: 4, md: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
