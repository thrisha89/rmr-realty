import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api.js";
import LeadForm from "./LeadForm.jsx";

// Extracts the numeric starting rate (e.g. 3899) from a priceLabel string
// such as "Starts from Rs. 3,899/- per sq ft*". Returns null if no verified
// numeric rate can be found — the calculator never invents a price.
function parseRatePerSqft(priceLabel) {
  if (!priceLabel) return null;
  const match = priceLabel.match(/(\d[\d,]*)/);
  if (!match) return null;
  const value = parseInt(match[1].replace(/,/g, ""), 10);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function formatINR(amount) {
  if (!Number.isFinite(amount)) return "₹0";
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

function RangeField({ id, label, valueLabel, min, max, step, value, onChange, light = false }) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={`text-xs font-semibold uppercase tracking-wider ${light ? "text-navy-100" : "text-[color:var(--color-text-muted)]"}`}>
          {label}
        </label>
        <span className={`text-sm font-semibold ${light ? "text-gold-300" : "text-navy-800"}`}>{valueLabel}</span>
      </div>
      <input
        id={id}
        type="range"
        className={`slider-premium w-full ${light ? "" : "slider-light"}`}
        style={{ "--fill": `${pct}%` }}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={valueLabel}
      />
    </div>
  );
}

export default function InvestmentPlanner({ compact = false }) {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [selectedSlug, setSelectedSlug] = useState("custom");
  const [plotSize, setPlotSize] = useState(1200);
  const [pricePerSqft, setPricePerSqft] = useState(3899);
  const [loanPercent, setLoanPercent] = useState(80);
  const [tenureYears, setTenureYears] = useState(20);
  const [interestRate, setInterestRate] = useState(10.5);
  const [leadOpen, setLeadOpen] = useState(false);

  useEffect(() => {
    api
      .getProjects()
      .then((d) => {
        const withRates = (d.projects || [])
          .filter((p) => p.isVerified && parseRatePerSqft(p.priceLabel))
          .map((p) => ({ ...p, baseRate: parseRatePerSqft(p.priceLabel) }));
        setProjects(withRates);
        if (withRates.length > 0) {
          setSelectedSlug(withRates[0].slug);
          setPricePerSqft(withRates[0].baseRate);
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  const selectedProject = projects.find((p) => p.slug === selectedSlug) || null;
  const baseRate = selectedProject?.baseRate || 3899;

  // When the selected project changes, reset the price-per-sqft slider to
  // that project's verified starting rate.
  useEffect(() => {
    if (selectedProject) setPricePerSqft(selectedProject.baseRate);
  }, [selectedSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const priceMin = Math.max(500, Math.round(baseRate * 0.7));
  const priceMax = Math.round(baseRate * 1.3);

  const results = useMemo(() => {
    const totalInvestment = plotSize * pricePerSqft;
    const loanAmount = (totalInvestment * loanPercent) / 100;
    const downPayment = totalInvestment - loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenureYears * 12;
    let emi = 0;
    if (monthlyRate === 0) {
      emi = loanAmount / months;
    } else {
      const factor = Math.pow(1 + monthlyRate, months);
      emi = (loanAmount * monthlyRate * factor) / (factor - 1);
    }
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;
    return { totalInvestment, loanAmount, downPayment, emi, totalPayment, totalInterest };
  }, [plotSize, pricePerSqft, loanPercent, tenureYears, interestRate]);

  const leadMessage = `Investment Planner enquiry${selectedProject ? ` — ${selectedProject.name}` : ""}.
Plot size: ${plotSize} sq. ft.
Price per sq. ft.: ${formatINR(pricePerSqft)}
Estimated total investment: ${formatINR(results.totalInvestment)}
Estimated loan (${loanPercent}%): ${formatINR(results.loanAmount)}
Estimated monthly EMI (${tenureYears} yrs @ ${interestRate}%): ${formatINR(results.emi)}/month`;

  return (
    <div className="overflow-hidden rounded-2xl bg-navy-800 shadow-[0_30px_60px_-30px_rgba(0,8,32,0.6)]">
      <div className="grid gap-0 lg:grid-cols-5">
        {/* Controls */}
        <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10">
          {projects.length > 0 && (
            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy-200">
                {t("calculator.selectProject")}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {projects.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => setSelectedSlug(p.slug)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      selectedSlug === p.slug
                        ? "bg-gold-500 text-navy-900 shadow-[0_8px_18px_-8px_rgba(200,144,56,0.6)]"
                        : "border border-white/20 text-navy-100 hover:border-gold-400 hover:text-gold-300"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedSlug("custom")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedSlug === "custom"
                      ? "bg-gold-500 text-navy-900 shadow-[0_8px_18px_-8px_rgba(200,144,56,0.6)]"
                      : "border border-white/20 text-navy-100 hover:border-gold-400 hover:text-gold-300"
                  }`}
                >
                  {t("calculator.customEstimate")}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-7">
            <RangeField
              id="plot-size"
              light
              label={t("calculator.plotSize")}
              valueLabel={`${plotSize.toLocaleString("en-IN")} sq. ft.`}
              min={600}
              max={4800}
              step={100}
              value={plotSize}
              onChange={setPlotSize}
            />
            <RangeField
              id="price-per-sqft"
              light
              label={t("calculator.pricePerSqft")}
              valueLabel={formatINR(pricePerSqft)}
              min={priceMin}
              max={priceMax}
              step={1}
              value={pricePerSqft}
              onChange={setPricePerSqft}
            />
            <RangeField
              id="loan-percent"
              light
              label={t("calculator.loanPercent")}
              valueLabel={`${loanPercent}%`}
              min={0}
              max={90}
              step={5}
              value={loanPercent}
              onChange={setLoanPercent}
            />
            <div className="grid gap-7 sm:grid-cols-2">
              <RangeField
                id="tenure"
                light
                label={t("calculator.tenure")}
                valueLabel={`${tenureYears} ${t("calculator.years")}`}
                min={5}
                max={25}
                step={1}
                value={tenureYears}
                onChange={setTenureYears}
              />
              <RangeField
                id="interest-rate"
                light
                label={t("calculator.interestRate")}
                valueLabel={`${interestRate.toFixed(1)}%`}
                min={7.5}
                max={13.5}
                step={0.1}
                value={interestRate}
                onChange={setInterestRate}
              />
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-navy-100">
            {selectedProject ? (
              <>
                {t("calculator.noteVerified", {
                  project: selectedProject.name,
                  rate: formatINR(selectedProject.baseRate),
                })}
              </>
            ) : (
              t("calculator.noteCustom")
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="border-t border-white/10 bg-navy-900 p-6 sm:p-8 lg:col-span-2 lg:border-l lg:border-t-0 lg:p-10">
          <p className="eyebrow mb-6 text-gold-400">{t("calculator.summaryTitle")}</p>

          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-navy-300">{t("calculator.totalCost")}</p>
              <p className="mt-1 font-display text-3xl font-bold text-white">{formatINR(results.totalInvestment)}</p>
            </div>
            <div className="h-px bg-white/10" />
            <div>
              <p className="text-xs uppercase tracking-wider text-navy-300">
                {t("calculator.downPayment")}
              </p>
              <p className="mt-1 text-xl font-semibold text-white">{formatINR(results.downPayment)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-navy-300">
                {t("calculator.loanAmount", { percent: loanPercent })}
              </p>
              <p className="mt-1 text-xl font-semibold text-white">{formatINR(results.loanAmount)}</p>
            </div>
            <div className="h-px bg-white/10" />
            <div>
              <p className="text-xs uppercase tracking-wider text-navy-300">
                {t("calculator.emiLabel", { years: tenureYears, rate: interestRate.toFixed(1) })}
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-gold-400">
                {formatINR(results.emi)} <span className="text-sm font-sans font-normal text-navy-200">/ {t("calculator.month")}</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-navy-300">{t("calculator.totalInterest")}</p>
              <p className="mt-1 text-base font-semibold text-navy-100">{formatINR(results.totalInterest)}</p>
            </div>
          </div>

          <button type="button" onClick={() => setLeadOpen(true)} className="btn-gold group mt-8 w-full">
            {t("calculator.proceed")}
            <svg viewBox="0 0 20 20" className="btn-icon h-4 w-4" fill="currentColor">
              <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="mt-3 text-center text-[11px] text-navy-400">{t("calculator.disclaimer")}</p>
        </div>
      </div>

      {leadOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setLeadOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-navy-800">{t("calculator.leadTitle")}</h3>
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">{t("calculator.leadSubtitle")}</p>
              </div>
              <button
                type="button"
                onClick={() => setLeadOpen(false)}
                aria-label={t("buttons.close")}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-navy-500 transition hover:bg-navy-50"
              >
                ✕
              </button>
            </div>
            <LeadForm
              source="investment_planner"
              projectSlug={selectedProject?.slug}
              projectName={selectedProject?.name}
              initialMessage={leadMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
