"use client";

import { useState, useEffect, useCallback } from "react";

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  prefersReducedMotion: boolean;
  pixelRatio: number;
  isLowPowerMode: boolean;
}

const defaultDeviceInfo: DeviceInfo = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isTouchDevice: false,
  prefersReducedMotion: false,
  pixelRatio: 1,
  isLowPowerMode: false,
};

export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(defaultDeviceInfo);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobile = /iPhone|iPod|Android.*Mobile/i.test(userAgent);
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
      const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const pixelRatio = window.devicePixelRatio || 1;
      
      // Estimate low power mode based on reduced battery/performance APIs
      // or just treat older mobile devices as low power
      const isLowPowerMode = isMobile && pixelRatio < 2;

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        isTouchDevice,
        prefersReducedMotion,
        pixelRatio,
        isLowPowerMode,
      });
    };

    checkDevice();
    
    // Listen for orientation/resize changes
    window.addEventListener("resize", checkDevice);
    
    // Listen for reduced motion preference changes
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
      motionQuery.removeEventListener("change", checkDevice);
    };
  }, []);

  return deviceInfo;
}

/**
 * Returns optimized animation settings based on device capabilities.
 */
export function useAnimationSettings() {
  const { isMobile, prefersReducedMotion, isLowPowerMode } = useDevice();

  return {
    // Disable complex animations on mobile or if reduced motion is preferred
    enableComplexAnimations: !isMobile && !prefersReducedMotion,
    
    // Shorter durations on mobile for snappier feel
    duration: prefersReducedMotion ? 0 : isMobile ? 0.3 : 0.6,
    
    // Simpler easing on mobile
    ease: isMobile 
      ? [0.25, 0.1, 0.25, 1] // ease
      : [0.22, 1, 0.36, 1],   // ease-out-quint
    
    // Reduce stagger on mobile
    staggerDelay: isMobile ? 0.05 : 0.1,
    
    // Skip heavy effects
    enableBlur: !isMobile && !isLowPowerMode,
    enableParallax: !prefersReducedMotion,
    enable3D: !isMobile && !prefersReducedMotion,
    
    // Reduce particle counts
    particleCount: isLowPowerMode ? 20 : isMobile ? 30 : 50,
  };
}

/**
 * Breakpoint hook for responsive logic.
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<"sm" | "md" | "lg" | "xl">("lg");

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("sm");
      else if (width < 1024) setBreakpoint("md");
      else if (width < 1280) setBreakpoint("lg");
      else setBreakpoint("xl");
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return {
    breakpoint,
    isSm: breakpoint === "sm",
    isMd: breakpoint === "md",
    isLg: breakpoint === "lg",
    isXl: breakpoint === "xl",
    isSmOrBelow: breakpoint === "sm",
    isMdOrBelow: breakpoint === "sm" || breakpoint === "md",
    isLgOrAbove: breakpoint === "lg" || breakpoint === "xl",
  };
}

/**
 * FPS monitor for performance debugging.
 * Only active in development mode.
 */
export function useFPSMonitor(enabled = false) {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== "development") return;

    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round(frameCount * 1000 / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      rafId = requestAnimationFrame(measureFPS);
    };

    rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, [enabled]);

  return fps;
}
