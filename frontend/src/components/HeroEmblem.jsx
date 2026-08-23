/**
 * Decorative, text-free emblem shown on the right side of every interior
 * page hero (About, Projects, Amenities, Calculator, Gallery, Contact,
 * Broker Registration) — replaces the old stat-card panel.
 *
 * A slowly rotating survey/compass motif over a faint blueprint grid,
 * with a glass center disc holding a page-specific line icon. Echoes the
 * "site plan" language of a real-estate brand and gives the wide right
 * side of the band a genuine focal point without adding any copy next
 * to an already text-led heading.
 *
 * `icon` is a single 24x24 feather-style SVG path `d` string, same
 * convention already used for the small icon badges elsewhere in the app.
 */
export default function HeroEmblem({ icon }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none hidden shrink-0 animate-[fadeInUp_1s_var(--ease-premium)_0.65s_both] xl:block"
    >
      <div className="relative h-72 w-72">
        <svg viewBox="0 0 320 320" className="h-full w-full overflow-visible">
          <defs>
            <pattern id="heroEmblemGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(220,183,104,0.18)" />
            </pattern>
            <radialGradient id="heroEmblemGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(220,183,104,0.32)" />
              <stop offset="100%" stopColor="rgba(220,183,104,0)" />
            </radialGradient>
          </defs>

          {/* Blueprint grid backdrop, bounded to a rounded plot outline */}
          <rect
            x="18"
            y="18"
            width="284"
            height="284"
            rx="26"
            fill="url(#heroEmblemGrid)"
            stroke="rgba(220,183,104,0.22)"
            strokeWidth="1"
          />

          {/* Survey corner marks, like a plan/viewfinder */}
          {[
            [18, 18, 1, 1],
            [302, 18, -1, 1],
            [18, 302, 1, -1],
            [302, 302, -1, -1],
          ].map(([x, y, sx, sy], i) => (
            <g
              key={i}
              transform={`translate(${x} ${y}) scale(${sx} ${sy})`}
              stroke="rgba(220,183,104,0.6)"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="0" y1="0" x2="16" y2="0" />
              <line x1="0" y1="0" x2="0" y2="16" />
            </g>
          ))}

          {/* Soft ambient glow behind the rings */}
          <circle cx="160" cy="160" r="118" fill="url(#heroEmblemGlow)" className="hero-emblem-glow" />

          {/* Outer dashed ring, rotating continuously */}
          <circle
            cx="160"
            cy="160"
            r="134"
            fill="none"
            stroke="rgba(220,183,104,0.4)"
            strokeWidth="1"
            strokeDasharray="2 7"
            strokeLinecap="round"
            className="hero-emblem-spin"
          />

          {/* Middle ring, draws itself in on load */}
          <circle
            cx="160"
            cy="160"
            r="104"
            fill="none"
            stroke="rgba(220,183,104,0.55)"
            strokeWidth="1.25"
            pathLength="1"
            className="hero-emblem-draw"
          />

          {/* Orbiting survey nodes */}
          <g className="hero-emblem-spin hero-emblem-spin--rev">
            <circle cx="160" cy="26" r="4" fill="#dcb768" className="hero-emblem-node" />
            <circle
              cx="274"
              cy="232"
              r="3"
              fill="#dcb768"
              className="hero-emblem-node"
              style={{ animationDelay: "1s" }}
            />
            <circle
              cx="50"
              cy="222"
              r="3"
              fill="#dcb768"
              className="hero-emblem-node"
              style={{ animationDelay: "2s" }}
            />
          </g>

          {/* Center glass disc */}
          <circle cx="160" cy="160" r="66" fill="rgba(0,24,56,0.55)" />
          <circle
            cx="160"
            cy="160"
            r="66"
            fill="none"
            stroke="rgba(220,183,104,0.6)"
            strokeWidth="1.5"
            pathLength="1"
            className="hero-emblem-draw"
            style={{ animationDelay: "0.3s" }}
          />

          {icon && (
            <svg
              x="132"
              y="132"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dcb768"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={icon} pathLength="1" className="hero-emblem-draw" style={{ animationDelay: "0.6s" }} />
            </svg>
          )}
        </svg>
      </div>
    </div>
  );
}
