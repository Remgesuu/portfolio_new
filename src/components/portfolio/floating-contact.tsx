"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useState, useEffect } from "react";

interface FloatingContactProps {
  email: string;
  phone?: string;
  showAfterScroll?: number;
}

/**
 * FloatingContact - Persistent contact button that appears after scroll
 * Provides quick access to contact info without leaving the page
 */
export function FloatingContact({
  email,
  phone,
  showAfterScroll = 400,
}: FloatingContactProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsVisible(latest > showAfterScroll);
    });

    return unsubscribe;
  }, [scrollY, showAfterScroll]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full w-14 h-14 bg-accent-primary text-white shadow-lg flex items-center justify-center font-bold text-lg hover:bg-accent-primary-hover transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ✉
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-20 right-0 bg-surface rounded-lg shadow-lg p-4 border border-border-default min-w-52"
              >
                <p className="text-xs uppercase tracking-widest text-text-disabled mb-3">
                  Get in touch
                </p>

                <div className="space-y-2">
                  <a
                    href={`mailto:${email}`}
                    className="block text-sm text-accent-primary hover:text-accent-primary-hover transition-colors break-all"
                  >
                    {email}
                  </a>
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="block text-sm text-accent-primary hover:text-accent-primary-hover transition-colors"
                    >
                      {phone}
                    </a>
                  )}
                </div>

                <p className="text-xs text-text-disabled mt-3 pt-3 border-t border-border-subtle">
                  Click to copy or tap to call
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
