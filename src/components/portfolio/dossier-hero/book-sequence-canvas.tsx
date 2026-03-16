"use client";

import { useRef, useEffect, useState, useCallback, memo } from "react";
import { motion, useTransform, useMotionValue, useSpring } from "motion/react";
import { BOOK_CONFIG, COLORS } from "./dossier-hero.config";
import type { BookSequenceCanvasProps } from "./dossier-hero.types";

/**
 * BookSequenceCanvas
 * 
 * Premium Apple-style scroll-driven book animation.
 * 
 * Key behaviors:
 * - Motion is LOCKED to scroll: when scroll stops, animation stops immediately
 * - No drift, no inertia, no catch-up feel  
 * - Book is the dominant visual mass; transforms enhance, not distract
 * 
 * Rendering approach:
 * - Uses hidden video + canvas for precise frame control
 * - RAF-throttled updates prevent jitter
 * - Progressive shadow spread synced to book opening
 */

// Minimum progress delta to trigger canvas redraw
const MIN_PROGRESS_DELTA = 0.0008;

export const BookSequenceCanvas = memo(function BookSequenceCanvas({
  progress,
  stage,
  isInteractive,
  className = "",
}: BookSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastProgressRef = useRef<number>(-1);
  const rafRef = useRef<number>(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  
  // Canvas dimensions (4:3 aspect for book)
  const canvasWidth = 1120;
  const canvasHeight = 840;

  // Progress as motion value for transforms
  const progressMotion = useMotionValue(progress);
  
  useEffect(() => {
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

  // Draw video frame to canvas on seek
  const handleSeeked = useCallback(() => {
    const video = videoRef.current;
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !ctx || !canvas) return;
    
    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }, []);

  // Sync video time with scroll progress
  useEffect(() => {
    if (!isInteractive || !isReady || videoDuration === 0) return;
    
    const video = videoRef.current;
    if (!video) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Only update if progress changed enough
    const delta = Math.abs(progress - lastProgressRef.current);
    if (delta < MIN_PROGRESS_DELTA && lastProgressRef.current !== -1) {
      return;
    }

    rafRef.current = requestAnimationFrame(() => {
      const clampedProgress = Math.max(0, Math.min(1, progress));
      const targetTime = clampedProgress * videoDuration;
      
      video.currentTime = targetTime;
      lastProgressRef.current = clampedProgress;
    });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [progress, isInteractive, isReady, videoDuration]);

  // Draw first frame when ready
  useEffect(() => {
    if (!isReady) return;
    const video = videoRef.current;
    if (video) video.currentTime = 0;
  }, [isReady]);

  // ===== TRANSFORMS =====
  // Book position and scale - subtle, supporting the content
  const bookY = useTransform(
    progressMotion,
    [...BOOK_CONFIG.transforms.y.keys],
    [...BOOK_CONFIG.transforms.y.values]
  );
  
  const bookScale = useTransform(
    progressMotion,
    [...BOOK_CONFIG.transforms.scale.keys],
    [...BOOK_CONFIG.transforms.scale.values]
  );
  
  const bookOpacity = useTransform(
    progressMotion,
    [...BOOK_CONFIG.transforms.opacity.keys],
    [...BOOK_CONFIG.transforms.opacity.values]
  );

  // Subtle depth rotation - book tilts slightly as it opens
  const rotateX = useTransform(
    progressMotion,
    [0, 0.1, 0.5, 0.8, 1],
    [2, 0, -1, 0, 1]
  );

  // Progressive shadow spread - increases as book opens
  const shadowSpread = useTransform(
    progressMotion,
    [0, 0.3, 0.6, 1],
    [20, 30, 40, 25]
  );
  
  const shadowOpacity = useTransform(
    progressMotion,
    [0, 0.3, 0.8, 1],
    [0.12, 0.18, 0.22, 0.15]
  );

  // Spring-smooth the shadow for organic feel
  const shadowSpreadSmooth = useSpring(shadowSpread, { stiffness: 100, damping: 20 });
  const shadowOpacitySmooth = useSpring(shadowOpacity, { stiffness: 100, damping: 20 });

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        y: bookY,
        scale: bookScale,
        opacity: bookOpacity,
        rotateX,
        perspective: 1200,
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
        // Desktop: Canvas-rendered frames locked to scroll
        <motion.div
          className="relative"
          style={{
            filter: useTransform(
              [shadowSpreadSmooth, shadowOpacitySmooth],
              ([spread, opacity]) => 
                `drop-shadow(0 ${spread}px ${Number(spread) * 2}px rgba(0,0,0,${opacity}))`
            ),
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="w-full h-auto max-w-[560px]"
            style={{
              opacity: isReady ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />
        </motion.div>
      ) : (
        // Mobile/reduced-motion: Still scroll-controlled, not autoplay
        // Uses lighter-weight video scrubbing (no canvas)
        <MobileBookPlayer
          progress={progress}
          videoSrc={BOOK_CONFIG.videoSrc}
        />
      )}

      {/* Loading spinner */}
      {isInteractive && !isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{
              borderColor: COLORS.warmGray,
              borderTopColor: COLORS.midTone,
            }}
          />
        </div>
      )}

      {/* Contact shadow - subtle ground plane */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-[75%] h-8 -z-10"
        style={{
          transform: "translateX(-50%) translateY(90%) scaleY(0.2)",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, transparent 70%)",
          filter: useTransform(shadowSpreadSmooth, (s) => `blur(${Number(s) * 0.4}px)`),
          opacity: shadowOpacitySmooth,
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
}

const MobileBookPlayer = memo(function MobileBookPlayer({
  progress,
  videoSrc,
}: MobileBookPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setIsReady(true);
  }, []);

  // Sync video time with progress (same as desktop, just using video element directly)
  useEffect(() => {
    if (!isReady || duration === 0) return;
    
    const video = videoRef.current;
    if (!video) return;

    const clampedProgress = Math.max(0, Math.min(1, progress));
    const targetTime = clampedProgress * duration;
    
    // Only update if difference is significant
    if (Math.abs(video.currentTime - targetTime) > 0.05) {
      video.currentTime = targetTime;
    }
  }, [progress, isReady, duration]);

  return (
    <div 
      className="w-full max-w-[400px] aspect-[4/3] flex items-center justify-center"
      style={{
        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.12))",
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
            className="w-5 h-5 border-2 rounded-full animate-spin"
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
