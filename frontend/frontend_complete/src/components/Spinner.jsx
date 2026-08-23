export default function Spinner({ label, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-10 ${className}`}>
      <span className="brand-spinner" role="status" aria-label={label || "Loading"} />
      {label && <p className="text-sm text-[color:var(--color-text-muted)]">{label}</p>}
    </div>
  );
}
