"use client";

import { motion, useMotionValue, useSpring, type Variants } from "motion/react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type CursorState = "default" | "hover" | "click" | "text" | "hidden";

interface CursorContextType {
  setCursorState: (state: CursorState) => void;
  setCursorText: (text: string) => void;
}

const CursorContext = createContext<CursorContextType>({
  setCursorState: () => {},
  setCursorText: () => {},
});

export function useCursor() {
  return useContext(CursorContext);
}

const cursorVariants: Variants = {
  default: {
    scale: 1,
    opacity: 1,
  },
  hover: {
    scale: 2.5,
    opacity: 1,
  },
  click: {
    scale: 0.8,
    opacity: 1,
  },
  text: {
    scale: 4,
    opacity: 0.8,
  },
  hidden: {
    scale: 0,
    opacity: 0,
  },
};

interface CustomCursorProps {
  children: ReactNode;
}

export function CustomCursorProvider({ children }: CustomCursorProps) {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed cursor position with spring physics
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Outer ring with slower spring for trailing effect
  const ringSpringConfig = { damping: 20, stiffness: 200, mass: 0.8 };
  const ringX = useSpring(mouseX, ringSpringConfig);
  const ringY = useSpring(mouseY, ringSpringConfig);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches || 
                  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseDown = () => setCursorState("click");
    const handleMouseUp = () => setCursorState("default");

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Add hover detection for interactive elements
    const handleElementHover = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorState("hover"));
        el.addEventListener("mouseleave", () => setCursorState("default"));
      });
    };

    // Run after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(handleElementHover, 100);

    // MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(handleElementHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [isMobile, isVisible, mouseX, mouseY]);

  // Don't render cursor on mobile
  if (isMobile) {
    return (
      <CursorContext.Provider value={{ setCursorState, setCursorText }}>
        {children}
      </CursorContext.Provider>
    );
  }

  return (
    <CursorContext.Provider value={{ setCursorState, setCursorText }}>
      {/* Hide default cursor globally */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {children}

      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={cursorVariants}
        animate={isVisible ? cursorState : "hidden"}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
      >
        <div 
          className="h-3 w-3 rounded-full bg-white"
          style={{ 
            boxShadow: "0 0 10px rgba(255,255,255,0.3)" 
          }}
        />
        
        {/* Cursor text label */}
        {cursorText && cursorState === "hover" && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-white"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Outer ring - trails behind */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: cursorState === "hover" ? 1.5 : cursorState === "click" ? 0.9 : 1,
          opacity: isVisible ? (cursorState === "hover" ? 0.6 : 0.3) : 0,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        <div 
          className="h-10 w-10 rounded-full border border-white/40"
          style={{
            backdropFilter: "blur(1px)",
          }}
        />
      </motion.div>
    </CursorContext.Provider>
  );
}

// Utility component to wrap elements that should trigger hover state
interface CursorHoverProps {
  children: ReactNode;
  text?: string;
  className?: string;
}

export function CursorHover({ children, text, className }: CursorHoverProps) {
  const { setCursorState, setCursorText } = useCursor();

  return (
    <div
      className={className}
      onMouseEnter={() => {
        setCursorState("hover");
        if (text) setCursorText(text);
      }}
      onMouseLeave={() => {
        setCursorState("default");
        setCursorText("");
      }}
    >
      {children}
    </div>
  );
}
