import { useEffect, useRef, useState } from "react";

// Animates a number from 0 up to the numeric part of `value` once the
// element scrolls into view. Any non-numeric prefix/suffix in `value`
// (e.g. "10+", "100%") is preserved and simply appended back on.
export default function CountUp({ value, duration = 1200, className = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(null);

  const match = String(value).match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match ? match[1] : "";
  const target = match ? parseFloat(match[2]) : null;
  const suffix = match ? match[3] : "";
  const decimals = match && match[2].includes(".") ? match[2].split(".")[1].length : 0;

  useEffect(() => {
    const node = ref.current;
    if (!node || target === null || typeof IntersectionObserver === "undefined") return;

    let frame;
    const animate = () => {
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay((target * eased).toFixed(decimals));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (target === null) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display ?? "0"}
      {suffix}
    </span>
  );
}
