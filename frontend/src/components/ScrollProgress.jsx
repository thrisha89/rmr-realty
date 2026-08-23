import { useEffect, useRef } from "react";

// A slim gold progress line fixed to the very top edge of the viewport,
// above the sticky header, that fills as the visitor scrolls the page.
// Purely decorative/orientational — it doesn't touch the header markup
// or styling, it just sits on top of it.
export default function ScrollProgress() {
  const fillRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      const ratio = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${ratio})`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="scroll-progress-track" aria-hidden="true">
      <div ref={fillRef} className="scroll-progress-fill" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
