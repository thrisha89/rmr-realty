import useParallax from "../hooks/useParallax.js";
import HeroEmblem from "./HeroEmblem.jsx";

/**
 * Splits an already-translated string into a "lead" line and a trailing
 * "gold" phrase of `goldWords` words, so the same multi-color heading
 * treatment can be applied to any page's title without hardcoding
 * English text (safe across every locale, since it only relies on
 * word-splitting on whitespace — the same technique already used for
 * the Home hero tagline).
 */
export function splitGold(text, goldWords = 2) {
  if (!text) return [text];
  const words = text.trim().split(/\s+/);
  if (words.length <= goldWords) return [{ text, gold: true }];
  const lead = words.slice(0, -goldWords).join(" ");
  const gold = words.slice(-goldWords).join(" ");
  return [lead, { text: gold, gold: true }];
}

/**
 * The one hero system shared by every interior customer-facing page
 * (About, Projects, Amenities, Calculator, Gallery, Contact, Broker
 * Registration). Guarantees identical height/proportions, left-aligned
 * composition, typographic scale, entrance motion and gold-highlight
 * treatment everywhere it's used, so pages read as one premium site
 * rather than independently designed screens.
 *
 * `heading` accepts either a translated string (pass through splitGold
 * first) or an array of lines, each either a plain string (renders
 * white) or `{ text, gold: true }` (renders in the brand gold
 * gradient) — each line gets its own staggered mask-reveal.
 *
 * Gold here only ever appears in the eyebrow and the heading phrase —
 * never as a glow/blob behind the content — per the brand's "gold in
 * type and accents, not atmosphere" rule for hero bands.
 */
export default function PageHero({
  eyebrow,
  heading,
  subtitle,
  bgWord,
  bgImage,
  bgImagePosition = "object-center",
  parallaxSpeed = 0.08,
  // Single 24x24 feather-style icon path shown inside the decorative
  // right-side emblem on large screens. Keeps the hero band from
  // reading as empty on wide viewports with a purely visual, page-
  // relevant motif — no copy competing with the heading for attention.
  icon,
  // --- Fully opt-in "showcase" treatment -------------------------------
  // Every prop below defaults to leaving rendering byte-identical to the
  // original hero for pages that don't pass them. Only Broker
  // Registration and Contact currently opt in (via heroVariant="showcase")
  // to get a lighter overlay, a tighter text-to-image transition, and a
  // visible (not hidden) image down to mobile — without touching the
  // shared min-height/padding rules that every other PageHero page relies
  // on for identical hero proportions.
  heroVariant = "default",
  // Focal point ("x% y%") the showcase image zooms toward — used to
  // favor the photo's actual subject over its flat backdrop. Expressed
  // as a transform-origin (not background-position) so it stays correct
  // no matter which axis `cover` ends up cropping at a given breakpoint.
  bgImageFocus,
  // Extra zoom applied on top of `cover`, as a plain multiplier (e.g.
  // "1.35"). `cover` alone already guarantees full-bleed with no gaps at
  // any breakpoint; this scales further so more of the supplied photo's
  // dead/flat backdrop is cropped out of view instead of sitting between
  // the text and the subject. Proportions are preserved (uniform scale).
  bgImageZoom,
}) {
  const imgRef = useParallax(parallaxSpeed);
  const lines = Array.isArray(heading) ? heading : [heading];
  const isShowcase = heroVariant === "showcase";

  return (
    <section className="page-hero relative overflow-hidden bg-navy-800">
      {bgImage && !isShowcase && (
        <div className="absolute inset-0 z-0 hidden lg:block" ref={imgRef}>
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className={`hero-image-settle h-full w-full object-cover ${bgImagePosition} [filter:saturate(80%)_brightness(0.92)]`}
          />
        </div>
      )}

      {/* Showcase image: a CSS background (not <img>) so it can be scaled
          past plain "cover" and shifted toward its subject, cropping out
          the supplied photo's flat backdrop instead of stretching or
          re-encoding the file itself. Shown at every breakpoint so mobile
          and tablet get the same photo instead of flat navy. */}
      {bgImage && isShowcase && (
        <div
          className="hero-image-showcase absolute inset-0 z-0"
          ref={imgRef}
          role="img"
          aria-label=""
          aria-hidden="true"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "saturate(96%) brightness(1)",
            transformOrigin: bgImageFocus || "center",
            "--hero-zoom": bgImageZoom || 1,
          }}
        />
      )}

      {/* Consistent navy depth scrim — deliberately no gold glow/burst
          here; the brand gold lives only in the type and rules below. */}
      <div
        className={
          !bgImage
            ? "absolute inset-0 z-10 bg-gradient-to-br from-navy-800 via-navy-800 to-navy-900"
            : isShowcase
            ? "absolute inset-0 z-10 bg-gradient-to-r from-navy-800 from-[2%] via-navy-800/80 via-[30%] to-navy-800/5 sm:from-[6%] sm:via-navy-800/72 sm:via-[34%] sm:to-navy-800/0 lg:from-[16%] lg:via-navy-800/48 lg:via-[46%] lg:to-transparent"
            : "absolute inset-0 z-10 bg-navy-800 lg:bg-transparent lg:bg-gradient-to-r lg:from-navy-800 lg:from-[38%] lg:via-navy-800/58 lg:via-[68%] lg:to-navy-800/15"
        }
      />
      {bgImage && !isShowcase && (
        <div className="absolute inset-0 z-10 hidden bg-gradient-to-t from-navy-900/50 via-transparent to-navy-900/20 lg:block" />
      )}
      {bgImage && isShowcase && (
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy-900/30 via-transparent to-transparent" />
      )}

      {bgWord && (
        <span aria-hidden="true" className="bg-word bg-word--fill-light right-6 top-8 z-10 sm:right-10">
          {bgWord}
        </span>
      )}

      <div className="container-content relative z-20">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
          <div className="hero-text-col">
            <p className="eyebrow mb-3 text-gold-400 animate-[fadeInUp_0.6s_var(--ease-premium)_both]">
              {eyebrow}
            </p>
            <h1 className="hero-heading font-display font-bold text-white">
              {lines.map((line, i) => {
                const isGold = typeof line === "object" && line.gold;
                const text = typeof line === "object" ? line.text : line;
                return (
                  <span
                    key={i}
                    className={`mask-reveal block ${isGold ? "text-gradient-gold" : ""}`}
                    style={{ animationDelay: `${140 + i * 170}ms` }}
                  >
                    {text}
                  </span>
                );
              })}
            </h1>
            {subtitle && (
              <p className="hero-subtitle mt-5 text-navy-100 animate-[fadeInUp_0.6s_var(--ease-premium)_0.55s_both]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
