import React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  VStack,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Button,
  Tooltip,
  Image,
} from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link, Outlet } from 'react-router-dom';

import logoLight from '../assets/logoLight.png';
import logoDark from '../assets/logoDark.png';
import backgroundVideo from '../assets/ai-video.mp4';

const Layout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.2)', 'rgba(26, 32, 44, 0.2)');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const navHoverBg = useColorModeValue('gray.100', 'gray.700');
  const logo = useColorModeValue(logoLight, logoDark);

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'Interview', to: '/interview' },
    { name: 'AI Interview', to: '/ai-interview' },
    { name: 'Feedback', to: '/feedback' },
  ];
      const geminiStyle = {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: '500', // Medium weight, very similar to the image
        fontSize: '21px', // Adjust size as needed
        color: '#dee9ffff', // A nice light gray for dark backgrounds
        letterSpacing: '-1px', // Slightly tighter letter spacing for a clean look
      };
      const geminiStyleLightBg = {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: '500',
        fontSize: '21px',
        color: '#000a17ff', // A dark gray for light backgrounds
        letterSpacing: '-1px',
      };
  return (
    <Box position="relative" minH="100vh" overflow="hidden">
      {/* Video Background */}
      <Box
        as="video"
        autoPlay
        loop
        muted
        playsInline
        position="fixed"
        top={0}
        left={0}
        width="100%"
        height="100%"
        objectFit="cover"
        zIndex={-1}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </Box>

      {/* Navbar */}
      <Flex
        as="nav"
        position="sticky"
        top="0"
        zIndex="100"
        bg={bgColor}
        backdropFilter="blur(5px)"
        boxShadow="md"
        p={3}
        px={{ base: 4, md: 8 }}
        align="center"
        justify="space-between"
        borderRadius="0 0 1.5rem 1.5rem"
      >
        <HStack spacing={1} align="center" cursor="pointer"
              transition="all 0.3s"
              _hover={{ transform: 'scale(1.05)' }}>
          <Image src={logo} alt="Logo" boxSize="40px" borderRadius="xl" />
          <Tooltip >
            <Text
              fontWeight="bold"
              fontSize=""
              color={textColor} 
              style={colorMode === 'light' ? geminiStyleLightBg : geminiStyle}
              transition="color 0.3s">
              InterviewPrep.AI
            </Text>
          </Tooltip>
        </HStack>

        {/* Desktop Links */}
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          {navItems.map((item) => (
            <Button
              key={item.name}
              as={Link}
              to={item.to}
              variant="ghost"
              borderRadius="full"
              fontWeight="medium"
              color={textColor}
              _hover={{ bg: navHoverBg, transform: 'scale(1.05)' }}
              transition="all 0.2s ease-in-out"
            >
              {item.name}
            </Button>
          ))}
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            borderRadius="full"
            _hover={{ bg: navHoverBg, transform: 'rotate(20deg)' }}
            transition="all 0.3s"
          />
        </HStack>

        {/* Mobile Menu */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          icon={<HamburgerIcon />}
          onClick={onOpen}
          variant="ghost"
          borderRadius="xl"
          aria-label="Open menu"
        />
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={bgColor} backdropFilter="blur(5px)">
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  as={Link}
                  to={item.to}
                  variant="ghost"
                  onClick={onClose}
                  fontWeight="semibold"
                  borderRadius="xl"
                  color={textColor}
                  _hover={{ bg: navHoverBg }}
                >
                  {item.name}
                </Button>
              ))}
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                borderRadius="xl"
                _hover={{ bg: navHoverBg }}
              />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Page Content */}
      <Box p={{ base: 4, md: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;