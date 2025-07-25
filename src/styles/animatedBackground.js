// src/styles/animatedBackground.js
import { keyframes } from "@emotion/react";

export const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const animatedBackgroundStyle = {
  bgGradient: "linear-gradient(-45deg, #7928CA, #FF0080, #2AFADF, #00FFFF)",
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 15s ease infinite`,
};
