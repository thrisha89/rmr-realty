export default function SectionHeading({ eyebrow, title, subtitle, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      <span className={`accent-rule mt-4 ${align === "center" ? "mx-auto" : ""}`} />
      {subtitle && <p className="mt-5 text-[color:var(--color-text-muted)]">{subtitle}</p>}
    </div>
  );
}
