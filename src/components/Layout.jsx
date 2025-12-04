import React, { useEffect, useRef, useState } from "react";
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
  Progress,
  Avatar,
  Spinner,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import * as THREE from "three";

import logoLight from "../assets/logoLight.png";
import logoDark from "../assets/logoDark.png";

const Layout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const { user, backendUser, loading, isAuthenticated, logout, displayName, photoURL } = useAuth();

  const [profileCompletion, setProfileCompletion] = useState(0);

  const bgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.12)",
    "rgba(26, 32, 44, 0.3)"
  );
  const textColor = useColorModeValue("#000a17", "#dee9ff");
  const logo = useColorModeValue(logoLight, logoDark);
  const accentColor = useColorModeValue("#2563eb", "#60a5fa");

  const animatedBtn = {
    transition: "all 0.2s ease-in-out",
    _hover: { transform: "scale(1.05)", boxShadow: "md", color: accentColor },
    _active: { transform: "scale(0.95)" },
  };

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Dashboard", to: "/dashboard" },
  ];

  // Calculate profile completion
  useEffect(() => {
    if (backendUser) {
      let completed = 0;
      if (backendUser.email) completed += 25;
      if (backendUser.full_name) completed += 25;
      if (backendUser.resume_uploaded) completed += 25;
      if (backendUser.interview_completed) completed += 25;
      setProfileCompletion(completed);
    } else {
      setProfileCompletion(0);
    }
  }, [backendUser]);

  // ⭐ Three.js Starfield Effect
  const mountRef = useRef(null);

  useEffect(() => {
    // Keep a reference to the DOM element to avoid potential null issues on unmount
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    // Create stars
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPositions = [];
    for (let i = 0; i < starCount; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        -Math.random() * 2000
      );
    }
    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starPositions, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    let mouseX = 0,
      mouseY = 0;
    let targetX = 0,
      targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX - window.innerWidth / 2;
      mouseY = e.clientY - window.innerHeight / 2;
    };

    const handleClick = () => {
      // Pulse effect on click
      starMaterial.size = 2.5;
      setTimeout(() => {
        starMaterial.size = 1.2;
      }, 300);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const animate = () => {
      requestAnimationFrame(animate);

      // Mouse movement rotation (smoothly interpolated)
      targetX += (mouseX * 0.002 - targetX) * 0.05;
      targetY += (-mouseY * 0.002 - targetY) * 0.05;

      stars.rotation.x = targetY;
      stars.rotation.y = targetX;

      // ✨ UPDATE: Scroll interaction added
      // This moves the camera forward into the stars as you scroll down the page.
      // The starting position is z=5, and it decreases as window.scrollY increases.
      // The 0.01 multiplier controls the "speed" of travel.
      camera.position.z = 5 - window.scrollY * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      // Ensure the child element exists before trying to remove it
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <Box position="relative" minH="100vh" overflowX="hidden">
      {/* 🌌 Starfield Background */}
      <Box
        ref={mountRef}
        position="fixed"
        top={0}
        left={0}
        w="100%"
        h="100%"
        zIndex={-1}
      />

      {/* Navbar */}
      <Flex
        as="nav"
        position="fixed" // Changed to fixed to stay visible on scroll
        top="0"
        w="100%" // Ensure it spans the full width
        zIndex="100"
        bg={bgColor}
        backdropFilter="blur(10px)"
        p={3}
        px={{ base: 4, md: 8 }}
        align="center"
        justify="space-between"
        borderRadius="0 0 1.5rem 1.5rem"
        boxShadow="lg"
      >
        {/* Logo */}
        <HStack
          spacing={2}
          align="center"
          cursor="pointer"
          {...animatedBtn}
          onClick={() => navigate("/")}
        >
          <Image src={logo} alt="Logo" boxSize="40px" borderRadius="xl" />
          <Tooltip label="InterviewPrep.AI">
            <Text fontWeight="bold" color={textColor}>
              InterviewPrep.AI
            </Text>
          </Tooltip>
        </HStack>

        {/* Desktop Menu */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          {navItems.map((item) => (
            <Button
              key={item.name}
              as={Link}
              to={item.to}
              variant="ghost"
              borderRadius="full"
              fontWeight="medium"
              {...animatedBtn}
              color={textColor}
            >
              {item.name}
            </Button>
          ))}

          {loading ? (
            <Spinner size="sm" color={accentColor} />
          ) : isAuthenticated ? (
            <>
              <Tooltip label="View Profile">
                <Avatar
                  size="sm"
                  name={displayName}
                  src={photoURL}
                  cursor="pointer"
                  border="2px solid"
                  borderColor={accentColor}
                  _hover={{ transform: "scale(1.1)", boxShadow: "lg" }}
                  onClick={() => navigate("/dashboard")}
                />
              </Tooltip>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                color={textColor}
                {...animatedBtn}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              colorScheme="blue"
              size="sm"
              onClick={onAuthOpen}
              borderRadius="full"
              {...animatedBtn}
            >
              Sign In
            </Button>
          )}

          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            borderRadius="full"
            {...animatedBtn}
          />
        </HStack>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<HamburgerIcon />}
          onClick={onOpen}
          variant="ghost"
          borderRadius="xl"
          aria-label="Open menu"
          {...animatedBtn}
        />
      </Flex>

      {/* Spacer to push content below the fixed navbar */}
      <Box pt="80px">
        {/* Profile Completion */}
        {isAuthenticated && (
          <Box px={{ base: 4, md: 8 }} mb={4}>
            <Progress
              value={profileCompletion}
              size="sm"
              colorScheme="blue"
              borderRadius="full"
              hasStripe
              isAnimated
            />
            <Text fontSize="sm" color={textColor} mt={1}>
              Profile Completion: {profileCompletion}%
            </Text>
          </Box>
        )}

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg={bgColor} backdropFilter="blur(10px)">
            <DrawerCloseButton {...animatedBtn} />
            <DrawerHeader color={textColor}>Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="start">
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    as={Link}
                    to={item.to}
                    variant="ghost"
                    w="100%"
                    onClick={onClose}
                    {...animatedBtn}
                    color={textColor}
                  >
                    {item.name}
                  </Button>
                ))}
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      w="100%"
                      borderRadius="xl"
                      onClick={() => {
                        onClose();
                        navigate("/dashboard");
                      }}
                      {...animatedBtn}
                    >
                      My Profile
                    </Button>
                    <Button
                      variant="outline"
                      w="100%"
                      borderRadius="xl"
                      onClick={() => {
                        onClose();
                        logout();
                      }}
                      {...animatedBtn}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    w="100%"
                    borderRadius="xl"
                    onClick={() => {
                      onClose();
                      onAuthOpen();
                    }}
                    {...animatedBtn}
                  >
                    Sign In
                  </Button>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Page Content */}
        <Box p={{ base: 4, md: 8 }}>
          <Outlet />
        </Box>
      </Box>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={onAuthClose} />
    </Box>
  );
};

export default Layout;