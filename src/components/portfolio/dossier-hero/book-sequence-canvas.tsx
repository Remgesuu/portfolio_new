"use client";

import { useRef, useEffect, useState, useCallback, memo } from "react";
import { motion, useTransform, useMotionValue, useSpring, animate } from "motion/react";
import { BOOK_CONFIG, COLORS } from "./dossier-hero.config";
import type { BookSequenceCanvasProps } from "./dossier-hero.types";

/**
 * BookSequenceCanvas
 * 
 * Premium Apple-style scroll-driven book animation.
 * 
 * Key behaviors:
 * - SOFT SCRUB: sourceProgress tracks scroll precisely, renderProgress 
 *   smoothly catches up with cinematic easing
 * - When scroll stops, animation settles quickly but without jitter
 * - Book is the dominant visual mass; sized to fit cleanly within viewport
 * - Movement feels slow, heavy, precise - like Apple product reveals
 * 
 * Rendering approach:
 * - Uses hidden video + canvas for precise frame control
 * - Interpolated progress prevents visible frame stepping
 * - Progressive shadow spread synced to book opening
 */

// Soft scrub configuration
const SOFT_SCRUB = {
  // Lerp factor per frame (0-1). Lower = smoother but laggier
  // 0.12 gives ~83ms to reach 95% of target - responsive but smooth
  lerpFactor: 0.12,
  // Minimum delta to continue interpolating
  minDelta: 0.0005,
  // Threshold below which we snap to target
  snapThreshold: 0.001,
};

// Book viewport sizing
const BOOK_SIZING = {
  // Max percentage of viewport height the book should occupy
  maxViewportHeight: 0.52,
  // Max percentage of viewport width
  maxViewportWidth: 0.38,
  // Base canvas dimensions (4:3 aspect)
  canvasWidth: 1120,
  canvasHeight: 840,
};

export const BookSequenceCanvas = memo(function BookSequenceCanvas({
  progress,
  stage,
  isInteractive,
  className = "",
}: BookSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number>(0);
  
  // Render progress - interpolates toward source progress
  const renderProgressRef = useRef<number>(0);
  const sourceProgressRef = useRef<number>(0);
  
  const [isReady, setIsReady] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [bookMaxWidth, setBookMaxWidth] = useState(480);

  // Progress as motion value for transforms
  const progressMotion = useMotionValue(progress);
  
  // Smoothed progress for UI transforms (not video scrubbing)
  const smoothProgress = useSpring(progressMotion, {
    stiffness: 180,
    damping: 28,
    mass: 0.8,
  });

  // Calculate responsive book size based on viewport
  useEffect(() => {
    const updateSize = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      
      // Calculate max dimensions based on viewport
      const maxHeight = vh * BOOK_SIZING.maxViewportHeight;
      const maxWidth = vw * BOOK_SIZING.maxViewportWidth;
      
      // Maintain 4:3 aspect ratio, constrain to smaller dimension
      const aspectRatio = BOOK_SIZING.canvasWidth / BOOK_SIZING.canvasHeight;
      const heightConstrained = maxHeight * aspectRatio;
      const widthConstrained = maxWidth;
      
      // Use the smaller of the two, with reasonable bounds
      const finalWidth = Math.min(
        Math.max(320, Math.min(heightConstrained, widthConstrained)),
        520 // Absolute max
      );
      
      setBookMaxWidth(finalWidth);
    };
    
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Update source progress when prop changes
  useEffect(() => {
    sourceProgressRef.current = progress;
    progressMotion.set(progress);
  }, [progress, progressMotion]);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d", { 
      alpha: true,
      desynchronized: true,
    });
    ctxRef.current = ctx;
  }, []);

  // Video ready handler
  const handleCanPlayThrough = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    setVideoDuration(video.duration);
    setIsReady(true);
    video.currentTime = 0;
  }, []);

  // Draw current video frame to canvas
  const drawFrame = useCallback(() => {
    const video = videoRef.current;
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }, []);

  // Soft scrub animation loop
  useEffect(() => {
    if (!isInteractive || !isReady || videoDuration === 0) return;
    
    const video = videoRef.current;
    if (!video) return;

    let isRunning = true;
    
    const tick = () => {
      if (!isRunning) return;
      
      const source = sourceProgressRef.current;
      const current = renderProgressRef.current;
      const delta = source - current;
      
      // Check if we need to continue interpolating
      if (Math.abs(delta) > SOFT_SCRUB.minDelta) {
        // Lerp toward source
        let newProgress: number;
        
        if (Math.abs(delta) < SOFT_SCRUB.snapThreshold) {
          // Snap to avoid endless micro-movements
          newProgress = source;
        } else {
          // Smooth interpolation
          newProgress = current + delta * SOFT_SCRUB.lerpFactor;
        }
        
        renderProgressRef.current = newProgress;
        
        // Update video time
        const clampedProgress = Math.max(0, Math.min(1, newProgress));
        const targetTime = clampedProgress * videoDuration;
        
        if (Math.abs(video.currentTime - targetTime) > 0.016) {
          video.currentTime = targetTime;
        }
      }
      
      rafRef.current = requestAnimationFrame(tick);
    };
    
    // Start animation loop
    rafRef.current = requestAnimationFrame(tick);
    
    return () => {
      isRunning = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isInteractive, isReady, videoDuration]);

  // Draw frame when video seeks
  const handleSeeked = useCallback(() => {
    drawFrame();
  }, [drawFrame]);

  // Draw first frame when ready
  useEffect(() => {
    if (!isReady) return;
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
    }
  }, [isReady]);

  // ===== TRANSFORMS =====
  // Use smoothed progress for transforms - gives premium feel
  const bookY = useTransform(
    smoothProgress,
    [...BOOK_CONFIG.transforms.y.keys],
    [...BOOK_CONFIG.transforms.y.values]
  );
  
  const bookScale = useTransform(
    smoothProgress,
    [...BOOK_CONFIG.transforms.scale.keys],
    [...BOOK_CONFIG.transforms.scale.values]
  );
  
  const bookOpacity = useTransform(
    smoothProgress,
    [...BOOK_CONFIG.transforms.opacity.keys],
    [...BOOK_CONFIG.transforms.opacity.values]
  );

  // Subtle depth rotation - book tilts slightly as it opens
  const rotateX = useTransform(
    smoothProgress,
    [0, 0.1, 0.5, 0.8, 1],
    [1.5, 0, -0.5, 0, 0.5]
  );

  // Progressive shadow spread - increases as book opens
  const shadowSpread = useTransform(
    smoothProgress,
    [0, 0.3, 0.6, 1],
    [16, 24, 32, 20]
  );
  
  const shadowOpacity = useTransform(
    smoothProgress,
    [0, 0.3, 0.8, 1],
    [0.08, 0.12, 0.16, 0.10]
  );

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        y: bookY,
        scale: bookScale,
        opacity: bookOpacity,
        rotateX,
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Hidden video source */}
      <video
        ref={videoRef}
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
        src={BOOK_CONFIG.videoSrc}
        playsInline
        muted
        preload="auto"
        onCanPlayThrough={handleCanPlayThrough}
        onSeeked={handleSeeked}
        autoPlay={false}
      />

      {isInteractive ? (
        // Desktop: Canvas-rendered frames with soft scrub
        <motion.div
          className="relative"
          style={{
            filter: useTransform(
              [shadowSpread, shadowOpacity],
              ([spread, opacity]) => 
                `drop-shadow(0 ${spread}px ${Number(spread) * 1.5}px rgba(0,0,0,${opacity}))`
            ),
          }}
        >
          <canvas
            ref={canvasRef}
            width={BOOK_SIZING.canvasWidth}
            height={BOOK_SIZING.canvasHeight}
            className="w-full h-auto"
            style={{
              maxWidth: `${bookMaxWidth}px`,
              opacity: isReady ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />
        </motion.div>
      ) : (
        // Mobile/reduced-motion: Still scroll-controlled, not autoplay
        <MobileBookPlayer
          progress={progress}
          videoSrc={BOOK_CONFIG.videoSrc}
          maxWidth={Math.min(bookMaxWidth, 360)}
        />
      )}

      {/* Loading spinner */}
      {isInteractive && !isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{
              borderColor: COLORS.warmGray,
              borderTopColor: COLORS.midTone,
            }}
          />
        </div>
      )}

      {/* Contact shadow - subtle ground plane */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-[60%] h-6 -z-10"
        style={{
          transform: "translateX(-50%) translateY(85%) scaleY(0.15)",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.06) 0%, transparent 70%)",
          filter: useTransform(shadowSpread, (s) => `blur(${Number(s) * 0.3}px)`),
          opacity: shadowOpacity,
        }}
      />
    </motion.div>
  );
});

// ============================================
// Mobile Book Player - scroll-controlled video
// ============================================

interface MobileBookPlayerProps {
  progress: number;
  videoSrc: string;
  maxWidth: number;
}

const MobileBookPlayer = memo(function MobileBookPlayer({
  progress,
  videoSrc,
  maxWidth,
}: MobileBookPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const renderProgressRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setIsReady(true);
  }, []);

  // Soft scrub for mobile too
  useEffect(() => {
    if (!isReady || duration === 0) return;
    
    const video = videoRef.current;
    if (!video) return;

    let isRunning = true;
    const sourceProgress = progress;
    
    const tick = () => {
      if (!isRunning) return;
      
      const current = renderProgressRef.current;
      const delta = sourceProgress - current;
      
      if (Math.abs(delta) > 0.001) {
        const newProgress = Math.abs(delta) < 0.002 
          ? sourceProgress 
          : current + delta * 0.15;
        
        renderProgressRef.current = newProgress;
        
        const targetTime = Math.max(0, Math.min(1, newProgress)) * duration;
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
          video.currentTime = targetTime;
        }
      }
      
      rafRef.current = requestAnimationFrame(tick);
    };
    
    rafRef.current = requestAnimationFrame(tick);
    
    return () => {
      isRunning = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [progress, isReady, duration]);

  return (
    <div 
      className="w-full aspect-[4/3] flex items-center justify-center"
      style={{
        maxWidth: `${maxWidth}px`,
        filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.08))",
      }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={videoSrc}
        playsInline
        muted
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        style={{
          opacity: isReady ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-4 h-4 border-2 rounded-full animate-spin"
            style={{
              borderColor: COLORS.warmGray,
              borderTopColor: COLORS.midTone,
            }}
          />
        </div>
      )}
    </div>
  );
});

export default BookSequenceCanvas;
