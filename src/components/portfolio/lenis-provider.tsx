"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
});

export function useLenis() {
  return useContext(LenisContext);
}

interface LenisProviderProps {
  children: ReactNode;
  options?: {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: "vertical" | "horizontal";
    gestureOrientation?: "vertical" | "horizontal" | "both";
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    infinite?: boolean;
  };
}

// Default easing - smooth expo-style curve like bokoko33
const defaultEasing = (t: number) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export function LenisProvider({ children, options = {} }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // Detect mobile for performance optimization
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.01 : (isMobile ? 1.0 : options.duration ?? 1.2),
      easing: options.easing ?? defaultEasing,
      orientation: options.orientation ?? "vertical",
      gestureOrientation: options.gestureOrientation ?? "vertical",
      smoothWheel: prefersReducedMotion ? false : (options.smoothWheel ?? true),
      wheelMultiplier: isMobile ? 1.2 : (options.wheelMultiplier ?? 1),
      touchMultiplier: options.touchMultiplier ?? 2,
      infinite: options.infinite ?? false,
    });

    lenisRef.current = lenis;
    setIsReady(true);

    // RAF loop for smooth updates
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [options]);

  // Handle anchor links smoothly
  useEffect(() => {
    if (!lenisRef.current) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            lenisRef.current?.scrollTo(element as HTMLElement, {
              offset: -80, // Account for fixed header
              duration: 1.2,
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [isReady]);

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number }
  ) => {
    lenisRef.current?.scrollTo(target, options);
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}

// Hook to get scroll progress (0-1) for animations
export function useLenisScroll() {
  const { lenis } = useLenis();
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    if (!lenis) return;

    const onScroll = ({ progress: p, velocity: v }: { progress: number; velocity: number }) => {
      setProgress(p);
      setVelocity(v);
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  return { progress, velocity, lenis };
}
