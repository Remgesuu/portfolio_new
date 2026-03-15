"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "motion/react";
import { CTAButton } from "./cta-button";
import { siteContent } from "@/content/site-content";

// Studio white to dark transition colors
const COLORS = {
  studioWhite: "#f8f6f3",
  warmGray: "#e8e4df", 
  midTone: "#9a958d",
  charcoal: "#2a2926",
  nearBlack: "#0a0a0c",
} as const;

// Initial background for SSR - prevents flash
const INITIAL_BG = COLORS.studioWhite;

// Stage configuration with labels and thoughts
const STAGES = [
  {
    id: 0,
    range: [0, 0.05] as [number, number],
    label: null,
    thought: null,
    isIntro: true,
  },
  {
    id: 1,
    range: [0.05, 0.30] as [number, number],
    label: "INTAKE",
    thought: "Every ticket tells a story",
  },
  {
    id: 2,
    range: [0.30, 0.55] as [number, number],
    label: "DIAGNOSIS",
    thought: "Patterns emerge from noise",
  },
  {
    id: 3,
    range: [0.55, 0.80] as [number, number],
    label: "ACTION",
    thought: "Systems replace repetition",
  },
  {
    id: 4,
    range: [0.80, 1.0] as [number, number],
    label: "RESOLVED",
    thought: "Clarity, documented",
    isConclusion: true,
  },
];

// Muted brass color for annotations
const BRASS_COLOR = "rgba(196, 165, 116, 0.6)";
const BRASS_ACTIVE = "rgba(196, 165, 116, 1)";

interface DossierHeroProps {
  resumeHref?: string;
  contactHref?: string;
}

export function DossierHero({ 
  resumeHref = "/resume", 
  contactHref = "#contact" 
}: DossierHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [headlineRevealed, setHeadlineRevealed] = useState(false);

  const { hero } = siteContent;

  // Manual scroll progress tracking - avoids Framer Motion's position warning
  const scrollYProgress = useMotionValue(0);
  
  useEffect(() => {
    const updateScrollProgress = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const containerHeight = container.offsetHeight - window.innerHeight;
      
      if (containerHeight <= 0) return;
      
      const scrolled = window.scrollY - containerTop;
      const progress = Math.max(0, Math.min(1, scrolled / containerHeight));
      scrollYProgress.set(progress);
    };
    
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress, { passive: true });
    updateScrollProgress(); // Initial calculation
    
    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [scrollYProgress]);

  // Smooth spring for video scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Book transforms based on scroll
  // Start: slightly down and small, quickly settle to center
  // Diagnosis: subtle push-in (scale up slightly)
  // Resolved: settle and fix
  const bookY = useTransform(scrollYProgress, [0, 0.05, 0.3, 0.8, 1], [40, 0, 0, 0, 0]);
  const bookScale = useTransform(scrollYProgress, [0, 0.05, 0.3, 0.55, 0.8, 1], [0.92, 1, 1, 1.03, 1, 0.98]);
  const bookOpacity = useTransform(scrollYProgress, [0, 0.03], [0.7, 1]);

  // Background color transition: studio-white -> dark
  // 0-70%: pure studio white
  // 70-90%: transition to warm gray then charcoal
  // 90-100%: settle into near-black
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.7, 0.85, 0.95, 1],
    [COLORS.studioWhite, COLORS.studioWhite, COLORS.warmGray, COLORS.charcoal, COLORS.nearBlack]
  );

  // Vignette/darkening from edges - appears in final 30%
  const vignetteOpacity = useTransform(scrollYProgress, [0.7, 0.9, 1], [0, 0.4, 0.7]);
  
  // Text color transition for readability
  const textPrimary = useTransform(
    scrollYProgress,
    [0, 0.7, 0.9, 1],
    ["#0a0a0c", "#0a0a0c", "#e8e4df", "#f8f6f3"]
  );
  const textSecondary = useTransform(
    scrollYProgress,
    [0, 0.7, 0.9, 1],
    ["#4a4a52", "#4a4a52", "#9a958d", "#a0a5ab"]
  );

  // Smooth springs for book motion
  const smoothBookY = useSpring(bookY, { stiffness: 120, damping: 25 });
  const smoothBookScale = useSpring(bookScale, { stiffness: 100, damping: 30 });

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

  // Video setup
  useEffect(() => {
    if (!isDesktop || reducedMotion || !videoRef.current) return;

    const video = videoRef.current;
    
    const handleLoadedMetadata = () => {
      setVideoReady(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    
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
        if (Math.abs(video.currentTime - targetTime) > 0.05) {
          video.currentTime = targetTime;
        }
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, isDesktop, reducedMotion, videoReady]);

  // Update current stage and trigger headline reveal
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      const stage = STAGES.findIndex(
        (s) => value >= s.range[0] && value < s.range[1]
      );
      setCurrentStage(stage === -1 ? STAGES.length - 1 : stage);
      
      // Trigger headline reveal after initial scroll
      if (value > 0.02 && !headlineRevealed) {
        setHeadlineRevealed(true);
      }
    });

    // Also trigger headline after short delay if no scroll
    const timer = setTimeout(() => setHeadlineRevealed(true), 800);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [scrollYProgress, headlineRevealed]);

  const isInteractive = isDesktop && !reducedMotion;
  const currentStageData = STAGES[currentStage];
  const showMetrics = currentStage === STAGES.length - 1;

  // Split headline into words for masked reveal
  const headlineWords = useMemo(() => hero.title.split(" "), [hero.title]);

  return (
    <section 
      ref={containerRef}
      className="relative"
      style={{ 
        height: "500vh",
        width: "100%",
        zIndex: 10,
        backgroundColor: INITIAL_BG,
      }}
      data-scroll-sequence
      aria-label="Introduction"
    >
      {/* Sticky container with animated background - covers entire viewport */}
      <motion.div 
        className="sticky top-0 left-0 h-screen w-screen overflow-hidden"
        style={{ 
          backgroundColor: bgColor,
          zIndex: 10,
        }}
      >
        {/* Atmospheric vignette - darkens from edges */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            opacity: vignetteOpacity,
            background: `
              radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, ${COLORS.nearBlack} 100%),
              linear-gradient(to top, ${COLORS.nearBlack} 0%, transparent 40%)
            `,
          }}
        />
        
        {/* Corner marks - editorial crop marks */}
        <CornerMarks />
        
        {/* Main content grid */}
        <div className="h-full w-full flex items-center justify-center px-6 lg:px-12">
          <div className="w-full max-w-[1400px] mx-auto relative">
            
            {/* Three-column layout: Left copy | Center book | Right annotations */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] gap-6 lg:gap-8 items-center min-h-[80vh]">
              
              {/* LEFT: Headline, support text, CTA */}
              <div className="relative z-10 order-2 lg:order-1 lg:pr-4">
                
                {/* Headline with masked reveal */}
                <div className="mb-4 overflow-hidden">
                  <motion.p 
                    className="font-mono text-xs uppercase tracking-widest mb-3"
                    style={{ color: textSecondary }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: headlineRevealed ? 1 : 0, y: headlineRevealed ? 0 : 10 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {hero.eyebrow}
                  </motion.p>
                  
                  <motion.h1 
                    className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1]"
                    style={{ color: textPrimary }}
                  >
                    {headlineWords.map((word, i) => (
                      <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
                        <motion.span
                          className="inline-block"
                          initial={{ y: "110%", rotateX: -80 }}
                          animate={{ 
                            y: headlineRevealed ? 0 : "110%", 
                            rotateX: headlineRevealed ? 0 : -80 
                          }}
                          transition={{ 
                            duration: 0.7, 
                            delay: 0.2 + i * 0.08,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          style={{ transformOrigin: "bottom" }}
                        >
                          {word}
                        </motion.span>
                      </span>
                    ))}
                  </motion.h1>
                </div>

                {/* Support text */}
                <motion.p 
                  className="text-sm leading-relaxed mb-6 max-w-[320px]"
                  style={{ color: textSecondary }}
                  initial={{ opacity: 0, filter: "blur(8px)" }}
                  animate={{ 
                    opacity: headlineRevealed ? 1 : 0, 
                    filter: headlineRevealed ? "blur(0px)" : "blur(8px)" 
                  }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {hero.description}
                </motion.p>

                {/* CTAs */}
                <motion.div 
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: headlineRevealed ? 1 : 0, y: headlineRevealed ? 0 : 10 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <CTAButton as="a" href={resumeHref} variant="primary" size="md">
                    View Resume
                  </CTAButton>
                  <CTAButton as="a" href={contactHref} variant="ghost" size="md">
                    Contact
                  </CTAButton>
                </motion.div>

                {/* Scroll hint - only at start */}
                <AnimatePresence>
                  {currentStage === 0 && headlineRevealed && (
                    <motion.div 
                      className="mt-8 flex items-center gap-2 text-xs"
                      style={{ color: textSecondary }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <span 
                        className="inline-block w-4 h-6 rounded-full relative"
                        style={{ border: "1px solid currentColor" }}
                      >
                        <motion.span 
                          className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ backgroundColor: "currentColor" }}
                          animate={{ y: [2, 14, 2] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </span>
                      Scroll to explore
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CENTER: Book/Video - seamless with studio environment */}
              <div className="relative order-1 lg:order-2 flex justify-center">
                <motion.div 
                  className="relative w-full max-w-[560px] aspect-[4/3]"
                  style={{
                    y: smoothBookY,
                    scale: smoothBookScale,
                    opacity: bookOpacity,
                  }}
                >
                  {/* Video - no container card, blends with studio white */}
                  {isInteractive ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain"
                      src="/scroll-sequences/dossier/book-sequence.mp4"
                      playsInline
                      muted
                      preload="auto"
                      style={{ 
                        opacity: videoReady ? 1 : 0,
                        transition: "opacity 0.4s ease",
                        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="w-20 h-24 mx-auto mb-4 rounded bg-[#e8e4df] shadow-lg" />
                        <p className="text-[#6a6a78] text-xs">
                          Desktop for full experience
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Loading state */}
                  {isInteractive && !videoReady && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#e8e4df] border-t-[#9a958d] rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Subtle contact shadow on "floor" */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-8 -z-10"
                    style={{
                      background: "radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, transparent 70%)",
                      filter: "blur(8px)",
                      transform: "translateX(-50%) translateY(50%) scaleY(0.3)",
                    }}
                  />
                </motion.div>
              </div>

              {/* RIGHT: Stage annotations + metrics */}
              <div className="relative z-10 order-3 lg:pl-4 flex flex-col justify-between h-full py-8 lg:py-16">
                
                {/* Stage label + thought (top right) */}
                <div className="lg:text-right">
                  <AnimatePresence mode="wait">
                    {currentStageData?.label && (
                      <motion.div
                        key={`stage-${currentStage}`}
                        initial={{ opacity: 0, filter: "blur(12px)", x: 20 }}
                        animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                        exit={{ opacity: 0, filter: "blur(8px)", x: -10 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p 
                          className="font-mono text-xs tracking-[0.2em] mb-2"
                          style={{ color: BRASS_ACTIVE }}
                        >
                          {currentStageData.label}
                        </p>
                        <motion.p 
                          className="text-sm italic max-w-[200px] lg:ml-auto"
                          style={{ color: textSecondary }}
                        >
                          "{currentStageData.thought}"
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Progress indicator (middle right) */}
                <div className="hidden lg:flex flex-col gap-2 items-end my-8">
                  {STAGES.slice(1).map((stage, idx) => (
                    <div
                      key={stage.id}
                      className="flex items-center gap-2"
                    >
                      <span 
                        className={`text-xs font-mono transition-all duration-300 ${
                          idx + 1 === currentStage ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ color: BRASS_COLOR }}
                      >
                        {stage.label}
                      </span>
                      <div
                        className="h-1 rounded-full transition-all duration-500"
                        style={{
                          width: idx + 1 <= currentStage ? "24px" : "8px",
                          backgroundColor: idx + 1 <= currentStage ? BRASS_ACTIVE : "var(--border-subtle)",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Metrics/proof - appear on Resolved stage (bottom right) */}
                <div className="lg:text-right">
                  <AnimatePresence>
                    {showMetrics && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-3"
                      >
                        <p 
                          className="font-mono text-xs tracking-widest mb-3"
                          style={{ color: BRASS_COLOR }}
                        >
                          EVIDENCE
                        </p>
                        {hero.signals.slice(0, 3).map((signal, i) => (
                          <motion.div
                            key={signal.label}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="text-right"
                          >
                            <motion.span 
                              className="font-semibold text-lg block"
                              style={{ color: textPrimary }}
                            >
                              {signal.value}
                            </motion.span>
                            <motion.span 
                              className="text-xs block max-w-[180px] ml-auto"
                              style={{ color: textSecondary }}
                            >
                              {signal.label}
                            </motion.span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/**
 * Editorial corner marks - subtle L-shaped marks in corners
 */
function CornerMarks() {
  const markStyle = {
    position: "absolute" as const,
    width: "24px",
    height: "24px",
    opacity: 0.4,
  };

  return (
    <>
      {/* Top-left */}
      <div style={{ ...markStyle, top: "24px", left: "24px" }}>
        <div style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "1px", 
          background: BRASS_COLOR 
        }} />
        <div style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "1px", 
          height: "100%", 
          background: BRASS_COLOR 
        }} />
      </div>
      
      {/* Top-right */}
      <div style={{ ...markStyle, top: "24px", right: "24px" }}>
        <div style={{ 
          position: "absolute", 
          top: 0, 
          right: 0, 
          width: "100%", 
          height: "1px", 
          background: BRASS_COLOR 
        }} />
        <div style={{ 
          position: "absolute", 
          top: 0, 
          right: 0, 
          width: "1px", 
          height: "100%", 
          background: BRASS_COLOR 
        }} />
      </div>
      
      {/* Bottom-left */}
      <div style={{ ...markStyle, bottom: "24px", left: "24px" }}>
        <div style={{ 
          position: "absolute", 
          bottom: 0, 
          left: 0, 
          width: "100%", 
          height: "1px", 
          background: BRASS_COLOR 
        }} />
        <div style={{ 
          position: "absolute", 
          bottom: 0, 
          left: 0, 
          width: "1px", 
          height: "100%", 
          background: BRASS_COLOR 
        }} />
      </div>
      
      {/* Bottom-right */}
      <div style={{ ...markStyle, bottom: "24px", right: "24px" }}>
        <div style={{ 
          position: "absolute", 
          bottom: 0, 
          right: 0, 
          width: "100%", 
          height: "1px", 
          background: BRASS_COLOR 
        }} />
        <div style={{ 
          position: "absolute", 
          bottom: 0, 
          right: 0, 
          width: "1px", 
          height: "100%", 
          background: BRASS_COLOR 
        }} />
      </div>
    </>
  );
}
