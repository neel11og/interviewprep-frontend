import {
  Box,
  Flex,
  Image,
  Text,
  Link,
  Spacer,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function Layout() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      {/* Sticky Navbar with Animated Background */}
      <MotionBox
        as="header"
        bgGradient="linear(to-r, purple.600, blue.500)"
        px={6}
        py={4}
        position="sticky"
        top={0}
        zIndex={1000}
        shadow="md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Flex align="center">
          <Image src="/logo.png" alt="Logo" boxSize="40px" mr={3} />
          <Text color="white" fontSize="xl" fontWeight="bold">
            InterviewPrep.AI
          </Text>

          <Spacer />

          {/* Nav Links */}
          <Flex gap={4}>
            <Link as={RouterLink} to="/interview" color="white">
              Interview
            </Link>
            <Link as={RouterLink} to="/feedback" color="white">
              Feedback
            </Link>
            <Link as={RouterLink} to="/ai-interview" color="white">
              AI Interview
            </Link>
          </Flex>

          {/* Light/Dark Mode Toggle */}
          <IconButton
            ml={6}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
            aria-label="Toggle theme"
          />
        </Flex>
      </MotionBox>

      {/* Page Content */}
      <Box as="main" px={4} py={6}>
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;
