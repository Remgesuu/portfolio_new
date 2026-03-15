/**
 * Loading state shown during page transitions.
 * Minimal dark screen that matches the preloader background
 * to prevent visual flash/"black stripe" during hydration.
 */
export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9998]"
      style={{ backgroundColor: "#0a0a0c" }}
      role="status"
      aria-label="Loading page"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
