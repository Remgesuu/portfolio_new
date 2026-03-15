"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import styles from "./typewriter.module.css";

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function Typewriter({
  phrases,
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = "",
}: TypewriterProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentPhrase = phrases[currentPhraseIndex];

  const tick = useCallback(() => {
    if (isPaused) return;

    if (!isDeleting) {
      // Typing
      if (displayedText.length < currentPhrase.length) {
        setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
      } else {
        // Finished typing, pause then start deleting
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting
      if (displayedText.length > 0) {
        setDisplayedText(displayedText.slice(0, -1));
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }
  }, [currentPhrase, displayedText, isDeleting, isPaused, pauseDuration, phrases.length]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  return (
    <span className={`${styles.typewriter} ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={displayedText}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className={styles.text}
        >
          {displayedText}
        </motion.span>
      </AnimatePresence>
      <motion.span
        className={styles.cursor}
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        |
      </motion.span>
    </span>
  );
}
