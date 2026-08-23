import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BUSINESS } from "../lib/constants.js";

const SESSION_KEY = "rmr_entry_seen_v1";

// Video begins shrinking immediately on exit; the full overlay (chrome +
// backdrop) starts its fade/scale-up reveal a beat later so the motion reads
// as sequential — "video settles away, then the site opens up behind it" —
// rather than everything dissolving in one flat cross-fade. Total time from
// trigger to unmount sits at ~1.1s, inside the requested 0.8–1.5s window.
const OVERLAY_EXIT_DELAY_MS = 260;
const OVERLAY_EXIT_MS = 900;
const TOTAL_EXIT_MS = OVERLAY_EXIT_DELAY_MS + OVERLAY_EXIT_MS;

/**
 * The brand's opening moment: a premium full-screen composition built
 * *around* the reel, not a stretched video embed. The video keeps its own
 * aspect ratio and sits centered with deliberate breathing room; the navy/
 * gold space around it is treated as real design surface (soft spotlight,
 * architectural corner marks, brand mark, grain) rather than empty margin.
 * On finish (or skip) the video scales down first, then the whole overlay
 * opens up to reveal the site already sitting underneath it.
 */
export default function EntryExperience() {
  const { t } = useTranslation();
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(SESSION_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [exiting, setExiting] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false); // metadata loaded, first frame available
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const { documentElement, body } = document;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      documentElement.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [show]);

  // Some browsers still block autoplay even when muted (rare, but happens
  // in embedded/webview contexts). Detect it and fall back to a clear,
  // visible "begin" control rather than leaving the visitor on a frozen
  // frame.
  useEffect(() => {
    if (!show) return;
    const video = videoRef.current;
    if (!video) return;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => setAutoplayBlocked(true));
    }
  }, [show]);

  if (!show) return null;

  const finish = () => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* private-browsing storage failures are fine to ignore here */
    }
    setShow(false);
  };

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    const video = videoRef.current;
    if (video) video.pause();
    window.setTimeout(finish, TOTAL_EXIT_MS);
  };

  const handleEnded = () => {
    // Brief pause on the completed frame before the exit sequence begins —
    // gives the final moment room to register instead of cutting instantly.
    window.setTimeout(handleEnter, 350);
  };

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = muted;
      video.play().then(() => setAutoplayBlocked(false)).catch(() => {});
    }
  };

  return (
    <div
      className={`entry-overlay fixed inset-0 z-[999] overflow-hidden bg-gold-50 ${
        exiting ? "entry-overlay--exiting" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`${BUSINESS.name} entry experience`}
    >
      {/* Designed backdrop: layered navy depth + soft gold spotlight behind
          the video + faint architectural guide lines + grain. This is the
          surface the video sits on, not a passive empty margin. */}
      <div className="entry-backdrop-wash pointer-events-none absolute inset-0" />
      <div className="entry-backdrop-glow pointer-events-none absolute inset-0" />
      <div className="entry-guides pointer-events-none absolute inset-0 hidden sm:block" />
      <div className="entry-grain pointer-events-none absolute inset-0" />

      {/* Pre-metadata veil so we never show a flash of black before the frame is ready */}
      {!ready && <div className="absolute inset-0 bg-gold-50" />}

      {/* Outer screen framing — quiet corner marks that echo the drafting-
          line language used across the rest of the site, giving the whole
          composition an intentional, gallery-like edge. */}
      <span className="entry-corner entry-corner--tl" />
      <span className="entry-corner entry-corner--tr" />
      <span className="entry-corner entry-corner--bl" />
      <span className="entry-corner entry-corner--br" />

      {/* The stage: video kept at its native aspect ratio, centered, with
          generous breathing room on every side. object-contain guarantees
          no stretch and no crop regardless of viewport shape; the "empty"
          letterbox space simply shows the backdrop behind it, so there is
          no visible box, border, or player chrome around the frame. */}
      <div
        className={`entry-stage pointer-events-none absolute inset-0 z-[5] flex items-center justify-center p-6 pb-28 pt-24 sm:p-10 sm:pb-32 sm:pt-28 lg:pb-24 ${
          exiting ? "entry-stage--exiting" : ""
        }`}
      >
        <div className="entry-video-frame entry-frame relative h-full max-h-[68vh] w-full max-w-[92vw] sm:max-h-[72vh] sm:max-w-[84vw] lg:max-h-[76vh] lg:max-w-[68vw] xl:max-w-[1180px]">
          <video
            ref={videoRef}
            className={`h-full w-full object-contain transition-opacity duration-[900ms] ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionTimingFunction: "var(--ease-premium)" }}
            src="/media/brand/entry.mp4"
            muted={muted}
            playsInline
            preload="auto"
            onLoadedMetadata={() => setReady(true)}
            onEnded={handleEnded}
          />
          {/* Slim focus-mark brackets set just outside the frame — a light
              editorial accent, not a border or card around the video. */}
          <span className="entry-video-corner entry-video-corner--tl" aria-hidden="true" />
          <span className="entry-video-corner entry-video-corner--tr" aria-hidden="true" />
          <span className="entry-video-corner entry-video-corner--bl" aria-hidden="true" />
          <span className="entry-video-corner entry-video-corner--br" aria-hidden="true" />
        </div>
      </div>

      <button
        type="button"
        onClick={handleEnter}
        className="absolute right-20 top-6 z-20 text-[11px] font-medium uppercase tracking-[0.25em] text-navy-500/70 transition-colors duration-300 hover:text-gold-600 sm:right-24 sm:top-8"
      >
        {t("entry.skip")}
      </button>

      <button
        type="button"
        onClick={() => {
          const video = videoRef.current;
          const nextMuted = !muted;
          setMuted(nextMuted);
          if (video) video.muted = nextMuted;
        }}
        aria-label={muted ? t("entry.unmuteVideo") : t("entry.muteVideo")}
        className="absolute right-6 top-5 z-20 grid h-9 w-9 place-items-center rounded-full border border-navy-900/12 bg-white/55 text-navy-700 backdrop-blur-sm transition-colors duration-300 hover:border-gold-400/70 hover:text-gold-600 sm:right-9 sm:top-6"
      >
        {muted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
            <path d="M11 5 6 9H3v6h3l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 9l5 6M22 9l-5 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
            <path d="M11 5 6 9H3v6h3l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.5 8.5a5 5 0 010 7M18.5 6a9 9 0 010 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Brand mark, top-left — a drawn-in line beneath it as the opening's
          first deliberate gesture, rather than text simply fading up */}
      <div className="pointer-events-none absolute left-6 top-6 z-10 flex flex-col gap-3 sm:left-9 sm:top-8">
        <p className="eyebrow-entry animate-[fadeInUp_0.9s_var(--ease-premium)_0.15s_both]">
          <span>RMR&nbsp;Realty</span>
        </p>
        <span className="entry-rule entry-rule-draw h-px w-16 sm:w-20" />
      </div>

      {/* Fallback control if the browser blocked autoplay entirely */}
      {autoplayBlocked && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <button
            type="button"
            onClick={handleManualPlay}
            className="btn-gold pointer-events-auto animate-[fadeInUp_0.6s_var(--ease-premium)_both] !px-9 !py-4 text-sm tracking-wide"
          >
            {t("entry.begin")}
            <span className="btn-icon" aria-hidden="true">→</span>
          </button>
        </div>
      )}

      {/* Bottom band — tagline only. The old numeric 0–100 progress rail is
          gone; controls stay to skip + mute, kept minimal and elegant. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-8 sm:px-9 sm:pb-10">
        <div className="mx-auto flex max-w-[1400px] items-end gap-5 sm:gap-6">
          <span className="entry-rule-draw entry-rule-draw--v hidden h-12 w-px bg-gradient-to-b from-transparent via-gold-500/60 to-transparent sm:block" />
          <h2 className="max-w-xl animate-[fadeInUp_1s_var(--ease-premium)_0.35s_both] font-display text-2xl font-medium leading-tight text-navy-800/85 sm:text-3xl lg:text-4xl">
            {t("home.tagline")}
          </h2>
        </div>
      </div>
    </div>
  );
}
