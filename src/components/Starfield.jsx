// src/components/Starfield.jsx
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// This component handles the actual star logic
function Stars({ count = 2000 }) { // You can pass a 'count' prop
  const points = useRef();

  // Create star positions only once, or when 'count' changes
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      // Position stars randomly across a large cube
      arr[i] = (Math.random() - 0.5) * 2000;
    }
    return arr;
  }, [count]);

  // This hook runs on every single frame
  useFrame(({ clock, mouse, camera }) => {
    // 1. Animate a slow, constant rotation
    const t = clock.getElapsedTime() * 0.05;
    points.current.rotation.y = t;
    
    // 2. Animate rotation based on mouse position
    points.current.rotation.x = mouse.y * 0.05;
    points.current.rotation.z = mouse.x * 0.05;
    
    // 3. Animate camera position based on scroll position
    // This creates the "flying through space" effect
    camera.position.z = 1 - window.scrollY * 0.001;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffffff"
        size={1.2}
        sizeAttenuation
        transparent
        opacity={0.9}
      />
    </points>
  );
}

// This is the main component you import into Home.jsx
export default function Starfield({ starCount }) {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -2, // Ensure it's in the background
        width: "100%",
        height: "100%",
        background: "black",
      }}
      camera={{ position: [0, 0, 1] }}
    >
      <Stars count={starCount} />
    </Canvas>
  );
}