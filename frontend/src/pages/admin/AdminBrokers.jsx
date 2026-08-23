import { useEffect, useState } from "react";
import { api } from "../../lib/api.js";

const STATUSES = ["new", "contacted", "closed"];
const STATUS_STYLES = {
  new: "bg-navy-50 text-navy-700",
  contacted: "bg-gold-50 text-gold-700",
  closed: "bg-emerald-50 text-emerald-700",
};

export default function AdminBrokers() {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => api.adminBrokers().then((d) => setBrokers(d.brokers)).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.adminUpdateBroker(id, status);
      await load();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Broker Registrations</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            {brokers.length} total partnership enquiries.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-16 animate-pulse bg-navy-50/60" />
          ))}
        </div>
      ) : brokers.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-[color:var(--color-border)] bg-white p-10 text-center text-sm text-[color:var(--color-text-muted)]">
          No broker registrations yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-navy-50 text-navy-700">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Agency</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {brokers.map((b) => (
                <tr key={b.id} className="border-b border-[color:var(--color-border)] transition-colors last:border-0 hover:bg-navy-50/40">
                  <td className="p-4 font-medium text-navy-800">{b.fullName}</td>
                  <td className="p-4 text-[color:var(--color-text-muted)]">
                    <div>{b.email}</div>
                    <div>{b.phone}</div>
                  </td>
                  <td className="p-4 text-[color:var(--color-text-muted)]">{b.agencyName || "—"}</td>
                  <td className="p-4 text-[color:var(--color-text-muted)]">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={b.status}
                      disabled={updatingId === b.id}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium capitalize transition-opacity focus:outline-none focus:ring-2 focus:ring-gold-400/40 disabled:opacity-50 ${STATUS_STYLES[b.status] || "bg-navy-50 text-navy-700"}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
