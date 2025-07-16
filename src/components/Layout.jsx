import {
  Box,
  Flex,
  IconButton,
  Link,
  useColorMode,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { SunIcon, MoonIcon, HamburgerIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function Layout() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgGradient = useColorModeValue(
    "linear(to-r, purple.100, blue.100)",
    "linear(to-r, gray.800, gray.900)"
  );

  const linkColor = useColorModeValue("gray.800", "white");
  const hoverColor = useColorModeValue("purple.600", "purple.300");

  return (
    <>
      {/* Navbar */}
      <MotionBox
        as="header"
        w="100%"
        bgGradient={bgGradient}
        px={4}
        py={3}
        position="sticky"
        top={0}
        zIndex={1000}
        boxShadow="sm"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
          {/* Logo */}
          <Link as={RouterLink} to="/">
            <Image
              src="/logo.png" // Place logo.png in public folder
              alt="Logo"
              h="40px"
            />
          </Link>

          {/* Desktop Links */}
          <Flex
            align="center"
            display={{ base: "none", md: "flex" }}
            gap={6}
            fontWeight="medium"
          >
            <Link
              as={RouterLink}
              to="/interview"
              color={linkColor}
              _hover={{ color: hoverColor }}
            >
              Interview
            </Link>
            <Link
              as={RouterLink}
              to="/ai-interview"
              color={linkColor}
              _hover={{ color: hoverColor }}
            >
              AI Interview
            </Link>
            <Link
              as={RouterLink}
              to="/feedback"
              color={linkColor}
              _hover={{ color: hoverColor }}
            >
              Feedback
            </Link>
          </Flex>

          {/* Toggle + Hamburger */}
          <Flex gap={2}>
            <IconButton
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
            />
            <IconButton
              icon={<HamburgerIcon />}
              onClick={onOpen}
              variant="ghost"
              aria-label="Menu"
              display={{ base: "inline-flex", md: "none" }}
            />
          </Flex>
        </Flex>
      </MotionBox>

      {/* Drawer for mobile nav */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <VStack spacing={6} mt={12} align="start" px={6}>
            <Link as={RouterLink} to="/interview" onClick={onClose}>
              Interview
            </Link>
            <Link as={RouterLink} to="/ai-interview" onClick={onClose}>
              AI Interview
            </Link>
            <Link as={RouterLink} to="/feedback" onClick={onClose}>
              Feedback
            </Link>
          </VStack>
        </DrawerContent>
      </Drawer>

      {/* Main content below navbar */}
      <Box px={4} py={6} maxW="1200px" mx="auto">
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;
