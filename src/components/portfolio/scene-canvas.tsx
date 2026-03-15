"use client";

import { Canvas, type RootState } from "@react-three/fiber";
import { Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { Suspense, useEffect, useState, type ReactNode } from "react";

interface SceneCanvasProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  dpr?: [number, number];
  gl?: Partial<WebGLContextAttributes>;
  onCreated?: (state: RootState) => void;
}

/**
 * 3D Canvas wrapper optimized for portfolio use.
 * - Automatically handles SSR
 * - Performance optimizations (adaptive DPR, events)
 * - Mobile detection for reduced complexity
 */
export function SceneCanvas({
  children,
  className = "",
  style,
  dpr = [1, 2],
  gl,
  onCreated,
}: SceneCanvasProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsMobile(
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.matchMedia("(pointer: coarse)").matches
    );
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Don't render canvas during SSR or if reduced motion is preferred
  if (!isMounted) {
    return (
      <div 
        className={className} 
        style={{ ...style, background: "var(--bg-secondary)" }}
      />
    );
  }

  if (prefersReducedMotion) {
    return (
      <div 
        className={className} 
        style={{ ...style, background: "var(--bg-secondary)" }}
      >
        {/* Static fallback for accessibility */}
      </div>
    );
  }

  return (
    <Canvas
      className={className}
      style={style}
      dpr={isMobile ? [1, 1.5] : dpr}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: isMobile ? "low-power" : "high-performance",
        ...gl,
      }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      onCreated={onCreated}
    >
      <Suspense fallback={null}>
        {/* Performance optimizations */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        {/* Ambient lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8}
          castShadow={!isMobile}
        />
        
        {/* Scene content */}
        {children}
        
        {/* Preload all assets */}
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

/**
 * Background 3D scene that sits behind content.
 * Position: fixed, covers entire viewport, z-index: -1
 */
interface BackgroundSceneProps {
  children: ReactNode;
}

export function BackgroundScene({ children }: BackgroundSceneProps) {
  return (
    <div 
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ isolation: "isolate" }}
    >
      <SceneCanvas
        className="h-full w-full"
        style={{ background: "transparent" }}
      >
        {children}
      </SceneCanvas>
    </div>
  );
}

/**
 * Placeholder component for future 3D objects.
 * This will be replaced with your custom 3D models.
 */
export function PlaceholderObject() {
  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#e8e4df" 
        transparent 
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
}

/**
 * Floating particles effect for ambient atmosphere.
 * Subtle, performant background effect.
 */
interface FloatingParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
}

export function FloatingParticles({
  count = 50,
  color = "#e8e4df",
  size = 0.02,
  spread = 10,
}: FloatingParticlesProps) {
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}
