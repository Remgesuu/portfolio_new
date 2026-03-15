"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import Link from "next/link";
import { CTAButton } from "./cta-button";

// Stage content configuration
const STAGES = [
  {
    id: 0,
    range: [0, 0.2] as [number, number],
    title: "Turning support noise into evidence",
    isIntro: true,
  },
  {
    id: 1,
    range: [0.2, 0.4] as [number, number],
    title: "Manual routing, payment friction, and unclear ownership start to surface.",
  },
  {
    id: 2,
    range: [0.4, 0.6] as [number, number],
    title: "Under pressure, broken handoffs and hidden operational debt become visible.",
  },
  {
    id: 3,
    range: [0.6, 0.8] as [number, number],
    title: "I redesign routing, ownership, and support flows into a clearer operating system.",
  },
  {
    id: 4,
    range: [0.8, 1.0] as [number, number],
    title: "The result is calmer operations, clearer decisions, and a more stable customer experience.",
    isConclusion: true,
  },
];

interface DossierHeroProps {
  resumeHref?: string;
  contactHref?: string;
}

export function DossierHero({ 
  resumeHref = "/resume", 
  contactHref = "#contact" 
}: DossierHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  // Scroll progress for the pinned section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring for video scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Check device and motion preferences
  useEffect(() => {
    const checkDevice = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                       window.innerWidth < 1024;
      setIsDesktop(!isMobile);
    };

    const checkMotion = () => {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };

    checkDevice();
    checkMotion();

    window.addEventListener("resize", checkDevice);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", checkMotion);

    return () => {
      window.removeEventListener("resize", checkDevice);
      motionQuery.removeEventListener("change", checkMotion);
    };
  }, []);

  // Video scrubbing effect
  useEffect(() => {
    if (!isDesktop || reducedMotion || !videoRef.current) return;

    const video = videoRef.current;
    
    const handleLoadedMetadata = () => {
      setVideoReady(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    
    // If already loaded
    if (video.readyState >= 1) {
      setVideoReady(true);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [isDesktop, reducedMotion]);

  // Sync video time with scroll
  useEffect(() => {
    if (!isDesktop || reducedMotion || !videoReady || !videoRef.current) return;

    const video = videoRef.current;
    
    const unsubscribe = smoothProgress.on("change", (value) => {
      if (video.duration) {
        const targetTime = value * video.duration;
        // Only seek if difference is significant to avoid jank
        if (Math.abs(video.currentTime - targetTime) > 0.05) {
          video.currentTime = targetTime;
        }
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, isDesktop, reducedMotion, videoReady]);

  // Update current stage based on progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      const stage = STAGES.findIndex(
        (s) => value >= s.range[0] && value < s.range[1]
      );
      setCurrentStage(stage === -1 ? STAGES.length - 1 : stage);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Opacity transforms for copy
  const copyOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.7, 0.9], [1, 1.02]);

  const isInteractive = isDesktop && !reducedMotion;
  const currentStageData = STAGES[currentStage];

  return (
    <section 
      ref={containerRef}
      style={{ 
        position: "relative",
        height: "500vh" // 5x viewport for smooth scrub
      }}
      data-scroll-sequence
      data-scroll-mode={isInteractive ? "interactive" : "poster"}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="h-full w-full flex items-center justify-center">
          {/* Two-column layout */}
          <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left: Copy column */}
            <motion.div 
              className="relative z-10 flex flex-col justify-center order-2 lg:order-1"
              style={{ opacity: copyOpacity }}
            >
              {/* Stage indicator */}
              <div className="flex gap-2 mb-6">
                {STAGES.map((stage, idx) => (
                  <div
                    key={stage.id}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      idx === currentStage 
                        ? "w-8 bg-[var(--accent-primary)]" 
                        : idx < currentStage 
                          ? "w-4 bg-[var(--text-secondary)]"
                          : "w-4 bg-[var(--border-default)]"
                    }`}
                  />
                ))}
              </div>

              {/* Dynamic stage content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-[var(--text-secondary)] font-mono text-sm mb-3 uppercase tracking-wider">
                    {currentStageData?.isIntro 
                      ? "The Problem" 
                      : currentStageData?.isConclusion 
                        ? "The Result" 
                        : `Stage ${currentStage + 1}`}
                  </p>
                  
                  <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-medium leading-tight text-[var(--text-primary)] text-balance mb-6">
                    {currentStageData?.title}
                  </h2>
                </motion.div>
              </AnimatePresence>

              {/* CTAs - always visible, emphasized at end */}
              <motion.div 
                className="flex flex-wrap gap-4 mt-4"
                style={{ scale: ctaScale }}
              >
                <CTAButton
                  as="a"
                  href={resumeHref}
                  variant="primary"
                  size="lg"
                >
                  View Resume
                </CTAButton>
                <CTAButton
                  as="a"
                  href={contactHref}
                  variant="ghost"
                  size="lg"
                >
                  Contact
                </CTAButton>
              </motion.div>

              {/* Scroll hint - only at start */}
              {currentStage === 0 && (
                <motion.p 
                  className="mt-8 text-sm text-[var(--text-disabled)] flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <span className="inline-block w-4 h-6 border border-[var(--border-default)] rounded-full relative">
                    <motion.span 
                      className="absolute left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--text-disabled)] rounded-full"
                      animate={{ y: [2, 14, 2] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </span>
                  Scroll to explore
                </motion.p>
              )}
            </motion.div>

            {/* Right: Media panel */}
            <div className="relative order-1 lg:order-2">
              <div 
                className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #faf9f7 0%, #f5f4f1 100%)",
                }}
              >
                {/* Video element - hidden on mobile/reduced motion */}
                {isInteractive ? (
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/scroll-sequences/dossier/book-sequence.mp4"
                    playsInline
                    muted
                    preload="auto"
                    style={{ 
                      opacity: videoReady ? 1 : 0,
                      transition: "opacity 0.3s ease"
                    }}
                  />
                ) : (
                  /* Fallback poster for mobile/reduced motion */
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#faf9f7] to-[#f0efe9]">
                    <div className="text-center p-8">
                      <div className="w-24 h-32 mx-auto mb-4 rounded-lg bg-[var(--border-subtle)] shadow-lg" />
                      <p className="text-[var(--text-secondary)] text-sm">
                        Scroll-driven experience available on desktop
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {isInteractive && !videoReady && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[var(--border-default)] border-t-[var(--accent-primary)] rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Subtle frame decoration */}
              <div 
                className="absolute -inset-4 -z-10 rounded-2xl opacity-50"
                style={{
                  background: "radial-gradient(ellipse at center, var(--gradient-ambient-primary) 0%, transparent 70%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
