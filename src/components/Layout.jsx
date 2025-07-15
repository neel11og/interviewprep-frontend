import {
  Box,
  Flex,
  Heading,
  IconButton,
  Spacer,
  useColorMode,
  useColorModeValue,
  Image,
  Link,
} from "@chakra-ui/react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Layout = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.900");

  return (
    <>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        bg={bg}
        minH="100vh"
      >
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          padding="1.5rem"
          bg={useColorModeValue("white", "gray.800")}
          color={useColorModeValue("gray.800", "white")}
          boxShadow="md"
          position="sticky"
          top="0"
          zIndex="1000"
        >
          {/* Logo */}
          <Flex align="center">
            <Image
              src="/logo.png"
              alt="Logo"
              boxSize="40px"
              mr="3"
              borderRadius="full"
            />
            <Heading as="h1" size="md">
              InterviewPrep.AI
            </Heading>
          </Flex>

          <Spacer />

          {/* Navigation Links */}
          <Flex gap="5">
            <Link as={RouterLink} to="/interview">
              Interview
            </Link>
            <Link as={RouterLink} to="/feedback">
              Feedback
            </Link>
            <Link as={RouterLink} to="/ai-interview">
              AI Interview
            </Link>
          </Flex>

          {/* Dark Mode Toggle */}
          <IconButton
            ml={4}
            aria-label="Toggle Dark Mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
        </Flex>

        {/* Render Nested Routes */}
        <Box p={8}>
          <Outlet />
        </Box>
      </MotionBox>
    </>
  );
};

export default Layout;
