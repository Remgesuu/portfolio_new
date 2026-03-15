import styles from "./skip-link.module.css";

interface SkipLinkProps {
  /** The target element ID to skip to (without #) */
  targetId?: string;
  /** Custom label for the skip link */
  label?: string;
}

/**
 * Skip link component for keyboard accessibility.
 * Allows users to skip navigation and jump directly to main content.
 * Uses native anchor behavior for best cross-browser compatibility (including WebKit).
 * Visible only on focus for screen reader and keyboard users.
 */
export function SkipLink({ 
  targetId = "main-content", 
  label = "Skip to main content" 
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={styles.skipLink}
    >
      {label}
    </a>
  );
}
