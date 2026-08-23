import { useEffect, useRef, useState } from "react";

/**
 * Wraps children in a fade-up reveal animation that triggers once the
 * element scrolls into view. Falls back to always-visible if
 * IntersectionObserver isn't available. Respects prefers-reduced-motion
 * via CSS (see .reveal in index.css).
 *
 * variant: "up" (default), "up-sm", "scale", "left", "right", "blur" —
 * lets different sections use a related but distinct entrance so the
 * page has motion rhythm instead of one repeated effect everywhere.
 */
export default function Reveal({ as: Tag = "div", delay = 0, variant, className = "", children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-variant={variant}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
