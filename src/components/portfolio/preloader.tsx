"use client";

import { motion, AnimatePresence, useAnimation } from "motion/react";
import { useEffect, useState, useCallback } from "react";

interface PreloaderProps {
  onComplete?: () => void;
  minimumDuration?: number;
}

export function Preloader({ 
  onComplete, 
  minimumDuration = 2400 
}: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "complete">("loading");
  const controls = useAnimation();

  // Simulate loading progress with eased timing
  useEffect(() => {
    const startTime = Date.now();
    const targetProgress = 100;
    
    // Eased progress simulation
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const duration = minimumDuration * 0.7; // Loading takes 70% of time
      
      if (elapsed < duration) {
        // Ease out cubic for natural feeling progress
        const t = elapsed / duration;
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(Math.floor(eased * targetProgress));
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
      }
    };
    
    requestAnimationFrame(updateProgress);
  }, [minimumDuration]);

  // Trigger reveal when progress hits 100
  useEffect(() => {
    if (progress === 100 && phase === "loading") {
      const revealDelay = setTimeout(() => {
        setPhase("reveal");
      }, 300);
      return () => clearTimeout(revealDelay);
    }
  }, [progress, phase]);

  // Complete and unmount after reveal animation
  useEffect(() => {
    if (phase === "reveal") {
      const completeDelay = setTimeout(() => {
        setPhase("complete");
        onComplete?.();
      }, 1000);
      return () => clearTimeout(completeDelay);
    }
  }, [phase, onComplete]);

  const handleExitComplete = useCallback(() => {
    document.body.style.overflow = "";
  }, []);

  // Lock scroll during preloader
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "complete") return null;

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {phase !== "complete" && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "var(--color-night-900)" }}
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
          }}
        >
          {/* Background gradient pulse */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 50% 50%, 
                  rgba(232, 228, 223, 0.03) 0%, 
                  transparent 70%
                )
              `,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-8">
            {/* Counter */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span 
                className="font-mono text-7xl font-light tracking-tighter"
                style={{ 
                  color: "var(--color-accent-primary)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {progress.toString().padStart(3, "0")}
              </span>
              
              {/* Subtle glow behind number */}
              <div 
                className="absolute inset-0 blur-2xl opacity-30"
                style={{ 
                  background: "var(--color-accent-primary)",
                  transform: "scale(1.5)",
                }}
              />
            </motion.div>

            {/* Progress bar */}
            <div className="relative w-48 h-px overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{ background: "var(--color-white-10)" }}
              />
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{ background: "var(--color-accent-primary)" }}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>

            {/* Loading text */}
            <motion.p
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: "var(--color-white-50)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {phase === "loading" ? "Loading experience" : "Welcome"}
            </motion.p>
          </div>

          {/* Curtain reveal overlay */}
          <motion.div
            className="absolute inset-0"
            style={{ 
              background: "var(--color-night-900)",
              transformOrigin: "top",
            }}
            initial={{ scaleY: 0 }}
            animate={phase === "reveal" ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Context to track if preloader has been shown this session
import { createContext, useContext, type ReactNode } from "react";

interface PreloaderContextType {
  hasLoaded: boolean;
  setHasLoaded: (value: boolean) => void;
}

const PreloaderContext = createContext<PreloaderContextType>({
  hasLoaded: false,
  setHasLoaded: () => {},
});

export function usePreloader() {
  return useContext(PreloaderContext);
}

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <PreloaderContext.Provider value={{ hasLoaded, setHasLoaded }}>
      {!hasLoaded && (
        <Preloader 
          onComplete={() => setHasLoaded(true)} 
          minimumDuration={2400}
        />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hasLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </PreloaderContext.Provider>
  );
}
