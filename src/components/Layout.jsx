// src/components/Layout.jsx
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  useColorMode,
  useColorModeValue,
  Spacer,
  Link,
} from "@chakra-ui/react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";


const Layout = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.800");

  return (
    <>
      <Box bg={bg} px={4} py={2} shadow="md" position="sticky" top={0} zIndex={999}>
        <Flex alignItems="center">
          {/* Logo and Title */}
          <RouterLink to="/">
            <HStack spacing={3}>
              <Image src="/logo.png" alt="logo" boxSize="40px" />
              <Box fontWeight="bold">InterviewPrep.AI</Box>
            </HStack>
          </RouterLink>

          <Spacer />

          {/* Navigation */}
          <HStack spacing={6}>
            <Link as={RouterLink} to="/interview" fontWeight="semibold">
              Interview
            </Link>
            <Link as={RouterLink} to="/feedback" fontWeight="semibold">
              Feedback
            </Link>
            <Link as={RouterLink} to="/ai-interview" fontWeight="semibold">
              AI Interview
            </Link>

            <IconButton
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle Theme"
            />
          </HStack>
        </Flex>
      </Box>

      <Box p={6}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
