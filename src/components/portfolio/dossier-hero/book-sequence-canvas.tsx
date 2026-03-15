"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useTransform, useMotionValue } from "motion/react";
import { BOOK_CONFIG } from "./dossier-hero.config";
import type { BookSequenceCanvasProps } from "./dossier-hero.types";

/**
 * BookSequenceCanvas
 * 
 * Handles the book animation based on scroll progress using canvas-based
 * frame rendering for pixel-perfect, instant frame switching.
 * 
 * Based on Apple-style scroll-driven animations:
 * - Preloads all frames before starting
 * - Uses requestAnimationFrame loop (separate from scroll handler)
 * - Only redraws when frame actually changes
 * - Falls back to video for mobile/reduced-motion
 */

const { frameSequence, videoSrc } = BOOK_CONFIG;
const TOTAL_FRAMES = frameSequence.totalFrames;
const BATCH_SIZE = frameSequence.batchSize;

export function BookSequenceCanvas({
  progress,
  stage,
  isInteractive,
  className = "",
}: BookSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const drawnFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number>(0);
  
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Preload all images in batches on mount
  useEffect(() => {
    if (!isInteractive) return;
    
    let mounted = true;
    const images: HTMLImageElement[] = [];
    
    const preloadImages = async () => {
      let loadedCount = 0;
      
      // Load in batches to avoid overwhelming the browser
      for (let batchStart = 0; batchStart < TOTAL_FRAMES; batchStart += BATCH_SIZE) {
        const batchPromises: Promise<HTMLImageElement>[] = [];
        const batchEnd = Math.min(batchStart + BATCH_SIZE, TOTAL_FRAMES);
        
        for (let i = batchStart; i < batchEnd; i++) {
          const frameNum = (i + 1).toString().padStart(4, "0");
          const src = `${frameSequence.basePath}${frameNum}${frameSequence.extension}`;
          
          batchPromises.push(
            new Promise<HTMLImageElement>((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              
              img.onload = () => {
                loadedCount++;
                if (mounted) {
                  setLoadProgress(loadedCount / TOTAL_FRAMES);
                }
                resolve(img);
              };
              
              img.onerror = () => {
                // Try fallback extension on error
                const fallbackSrc = `${frameSequence.basePath}${frameNum}${frameSequence.fallbackExtension}`;
                img.src = fallbackSrc;
                // If fallback also fails, still resolve with the failed image
                img.onerror = () => {
                  loadedCount++;
                  if (mounted) {
                    setLoadProgress(loadedCount / TOTAL_FRAMES);
                  }
                  resolve(img);
                };
              };
              
              img.src = src;
            })
          );
        }
        
        const batchImages = await Promise.all(batchPromises);
        images.push(...batchImages);
      }
      
      if (mounted) {
        imagesRef.current = images;
        setImagesLoaded(true);
        
        // Set canvas size from first image
        if (images[0]?.naturalWidth) {
          setCanvasSize({
            width: images[0].naturalWidth,
            height: images[0].naturalHeight,
          });
        }
      }
    };

    preloadImages();
    
    return () => {
      mounted = false;
    };
  }, [isInteractive]);

  // Separate RAF loop for rendering (never draws in scroll handler)
  useEffect(() => {
    if (!isInteractive || !imagesLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let running = true;
    
    const tick = () => {
      if (!running) return;
      
      const currentFrame = currentFrameRef.current;
      const drawnFrame = drawnFrameRef.current;
      
      // Only redraw when frame actually changed
      if (currentFrame !== drawnFrame) {
        const img = imagesRef.current[currentFrame];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          drawnFrameRef.current = currentFrame;
        }
      }
      
      rafIdRef.current = requestAnimationFrame(tick);
    };
    
    rafIdRef.current = requestAnimationFrame(tick);
    
    return () => {
      running = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isInteractive, imagesLoaded]);

  // Update current frame based on progress (this is what scroll events trigger)
  useEffect(() => {
    if (!isInteractive || !imagesLoaded) return;
    
    // Map progress (0-1) to frame index (0 to TOTAL_FRAMES-1)
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1)))
    );
    
    currentFrameRef.current = frameIndex;
  }, [progress, isInteractive, imagesLoaded]);

  // Transform values for book motion
  const progressMotion = useMotionValue(progress);
  
  useEffect(() => {
    progressMotion.set(progress);
  }, [progress, progressMotion]);

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

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        y: bookY,
        scale: bookScale,
        opacity: bookOpacity,
      }}
    >
      {isInteractive ? (
        <>
          {/* Canvas element for frame rendering */}
          <canvas
            ref={canvasRef}
            width={canvasSize.width || 1920}
            height={canvasSize.height || 1080}
            className="w-full max-w-[560px] h-auto"
            style={{
              opacity: imagesLoaded ? 1 : 0,
              transition: "opacity 0.4s ease",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
              // Soft edge mask for floating effect
              maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)",
            }}
          />
          
          {/* Loading indicator - shown during preload */}
          {!imagesLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div 
                className="w-8 h-8 border-2 rounded-full animate-spin"
                style={{
                  borderColor: "var(--color-accent-primary)",
                  borderTopColor: "transparent",
                }}
              />
              <div className="flex flex-col items-center gap-1">
                <span 
                  className="font-mono text-sm tabular-nums"
                  style={{ color: "var(--color-accent-primary)" }}
                >
                  {Math.round(loadProgress * 100)}%
                </span>
                <span 
                  className="font-mono text-xs uppercase tracking-widest"
                  style={{ color: "var(--color-white-50)" }}
                >
                  Loading frames
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-32 h-px overflow-hidden mt-1">
                <div 
                  className="absolute inset-0"
                  style={{ background: "var(--color-white-10)" }}
                />
                <div
                  className="h-full transition-[width] duration-100 ease-linear"
                  style={{ 
                    width: `${loadProgress * 100}%`,
                    background: "var(--color-accent-primary)",
                  }}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        // Mobile/reduced-motion fallback - autoplay video
        <div className="w-full max-w-[560px] aspect-[16/9] flex items-center justify-center">
          <video
            className="w-full h-full object-contain"
            src={videoSrc}
            playsInline
            muted
            autoPlay
            loop
            style={{
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
            }}
          />
        </div>
      )}

      {/* Contact shadow - provides grounding effect */}
      <div
        className="absolute bottom-0 left-1/2 w-[70%] h-6 -z-10"
        style={{
          transform: "translateX(-50%) translateY(80%) scaleY(0.25)",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </motion.div>
  );
}
