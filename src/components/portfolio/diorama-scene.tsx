"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  RoundedBox, 
  Float,
  Environment,
  ContactShadows,
  MeshTransmissionMaterial
} from "@react-three/drei";
import * as THREE from "three";

// Global scroll state for R3F (avoids React context issues with Canvas)
const scrollState = { progress: 0, velocity: 0 };

// Soft pastel palette matching the vision
const COLORS = {
  ivory: "#f5f0e6",
  warmIvory: "#f9f4e8", 
  dustyGraphite: "#4a4a52",
  softGraphite: "#5c5c66",
  mutedBrass: "#c4a574",
  paleBluegray: "#d1d5de",
  softSage: "#c8d4c4",
  cream: "#faf8f3",
  shell: "#3d3d44",
};

/**
 * Main dossier artifact - the layered operational slab
 */
function DossierArtifact() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Smooth scroll-linked rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      // Base rotation from scroll (reads from global state)
      const targetRotationY = scrollState.progress * Math.PI * 2;
      const targetRotationX = Math.sin(scrollState.progress * Math.PI) * 0.15;
      
      // Smooth interpolation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        delta * 2
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        delta * 2
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Outer shell - soft graphite */}
      <RoundedBox 
        args={[3, 0.4, 2.2]} 
        radius={0.08} 
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color={COLORS.shell}
          roughness={0.85}
          metalness={0.05}
        />
      </RoundedBox>

      {/* Document layer stack */}
      <DocumentLayers />
      
      {/* Index tabs */}
      <IndexTabs />
      
      {/* Translucent routing sheet */}
      <RoutingSheet />
      
      {/* Small detail elements */}
      <DetailElements />
    </group>
  );
}

/**
 * Stacked document layers - warm ivory sheets
 */
function DocumentLayers() {
  const layers = useMemo(() => {
    const items = [];
    const count = 6;
    
    for (let i = 0; i < count; i++) {
      const yOffset = 0.2 + i * 0.025;
      const xOffset = (i % 2) * 0.02 - 0.01;
      const zOffset = Math.sin(i * 0.5) * 0.02;
      
      items.push({
        position: [xOffset, yOffset, zOffset] as [number, number, number],
        color: i % 2 === 0 ? COLORS.ivory : COLORS.warmIvory,
        width: 2.6 - i * 0.03,
        depth: 1.8 - i * 0.02,
      });
    }
    return items;
  }, []);

  return (
    <group>
      {layers.map((layer, i) => (
        <RoundedBox
          key={i}
          args={[layer.width, 0.015, layer.depth]}
          radius={0.01}
          smoothness={2}
          position={layer.position}
        >
          <meshStandardMaterial
            color={layer.color}
            roughness={0.9}
            metalness={0}
          />
        </RoundedBox>
      ))}
    </group>
  );
}

/**
 * Brass index tabs on the side
 */
function IndexTabs() {
  const tabs = useMemo(() => [
    { y: 0.22, z: -0.6, label: "SYS" },
    { y: 0.25, z: -0.2, label: "OPS" },
    { y: 0.28, z: 0.2, label: "LOG" },
    { y: 0.31, z: 0.6, label: "OUT" },
  ], []);

  return (
    <group position={[1.35, 0, 0]}>
      {tabs.map((tab, i) => (
        <group key={i} position={[0, tab.y, tab.z]}>
          <RoundedBox
            args={[0.15, 0.03, 0.25]}
            radius={0.01}
            smoothness={2}
          >
            <meshStandardMaterial
              color={COLORS.mutedBrass}
              roughness={0.4}
              metalness={0.6}
            />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}

/**
 * Translucent routing sheet overlay
 */
function RoutingSheet() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = 0.38 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0.1, 0.38, 0]} rotation={[0, 0.05, 0]}>
      <planeGeometry args={[2.2, 1.5]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={0.02}
        chromaticAberration={0.02}
        anisotropy={0.1}
        distortion={0}
        distortionScale={0}
        temporalDistortion={0}
        transmission={0.95}
        roughness={0.3}
        color={COLORS.paleBluegray}
      />
    </mesh>
  );
}

/**
 * Small detail elements - dots, lines suggesting data
 */
function DetailElements() {
  return (
    <group position={[0, 0.35, 0]}>
      {/* Small indicator dots */}
      {[
        { pos: [-0.8, 0, 0.5], color: COLORS.softSage },
        { pos: [-0.6, 0, 0.5], color: COLORS.mutedBrass },
        { pos: [-0.4, 0, 0.5], color: COLORS.paleBluegray },
      ].map((dot, i) => (
        <mesh key={i} position={dot.pos as [number, number, number]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial 
            color={dot.color} 
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
      ))}
      
      {/* Subtle line elements suggesting text/data */}
      {[0, 0.12, 0.24, 0.36].map((z, i) => (
        <mesh key={`line-${i}`} position={[-0.3, 0, -0.4 + z]}>
          <boxGeometry args={[1.2 - i * 0.2, 0.004, 0.015]} />
          <meshStandardMaterial 
            color={COLORS.softGraphite}
            roughness={0.9}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Ambient floating particles - like dust motes in soft light
 */
function FloatingParticles() {
  const count = 20;
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
        ],
        scale: Math.random() * 0.02 + 0.01,
        speed: Math.random() * 0.3 + 0.1,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const dummy = new THREE.Object3D();
    particles.forEach((particle, i) => {
      const t = state.clock.elapsedTime * particle.speed;
      dummy.position.set(
        particle.position[0] + Math.sin(t + i) * 0.1,
        particle.position[1] + Math.cos(t + i * 0.5) * 0.15,
        particle.position[2]
      );
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={COLORS.cream} transparent opacity={0.4} />
    </instancedMesh>
  );
}

/**
 * Scene setup with camera and lighting
 */
function SceneSetup() {
  const { camera } = useThree();
  
  // Subtle camera movement based on scroll
  useFrame(() => {
    const targetZ = 5 - scrollState.progress * 0.5;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.02);
  });

  return (
    <>
      {/* Soft ambient lighting - gentle daylight feel */}
      <ambientLight intensity={0.6} color="#fdfbf7" />
      
      {/* Main key light - warm and soft */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8}
        color="#fff9f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light - cool balance */}
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.3}
        color="#e8eef5"
      />
      
      {/* Subtle rim light */}
      <pointLight
        position={[0, -3, 0]}
        intensity={0.2}
        color="#f5f0e6"
      />
    </>
  );
}

/**
 * Main diorama canvas component
 */
interface DioramaSceneProps {
  className?: string;
}

export function DioramaScene({ className }: DioramaSceneProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Setup scroll listener on mount
  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      scrollState.progress = progress;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial value
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ 
          position: [0, 2, 5], 
          fov: 35,
          near: 0.1,
          far: 100
        }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: "transparent" }}
      >
        <SceneSetup />
        
        <Float
          speed={1}
          rotationIntensity={0.1}
          floatIntensity={0.3}
          floatingRange={[-0.05, 0.05]}
        >
          <DossierArtifact />
        </Float>
        
        <FloatingParticles />
        
        {/* Soft contact shadow */}
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.3}
          scale={8}
          blur={2.5}
          far={2}
          color="#2a2a30"
        />
        
        {/* Soft environment for reflections */}
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}

/**
 * Wrapper component that shows on desktop only
 */
export function DioramaBackground() {
  const [showScene, setShowScene] = useState(false);
  
  useEffect(() => {
    // Only show on desktop with good GPU
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const hasReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (!isMobile && !hasReducedMotion) {
      setShowScene(true);
    }
  }, []);

  if (!showScene) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        opacity: 0.9,
        mixBlendMode: "normal"
      }}
    >
      <DioramaScene className="w-full h-full" />
    </div>
  );
}

export default DioramaScene;
