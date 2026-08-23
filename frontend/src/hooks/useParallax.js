import { useEffect, useRef } from "react";

/**
 * Very small, dependency-free parallax effect: while the attached
 * element is on screen, its transform is nudged vertically in
 * proportion to scroll position. rAF-throttled and IntersectionObserver
 * gated so it costs nothing while off-screen, and it no-ops entirely
 * for prefers-reduced-motion. Used sparingly (hero background only).
 */
export default function useParallax(speed = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let ticking = false;
    let inView = false;

    const apply = () => {
      ticking = false;
      if (!inView) return;
      const rect = node.getBoundingClientRect();
      const offset = (rect.top - window.innerHeight / 2) * speed;
      node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) onScroll();
      },
      { threshold: 0 }
    );
    observer.observe(node);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed]);

  return ref;
}
