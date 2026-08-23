import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api.js";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "", label: "All" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = (status) =>
    api
      .adminUsers(status)
      .then((d) => {
        setUsers(d.users);
        setCounts(d.counts);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    setLoading(true);
    load(tab);
  }, [tab]);

  const act = async (id, action) => {
    setBusyId(id);
    try {
      if (action === "approve") await api.adminApproveUser(id);
      else if (action === "reject") await api.adminRejectUser(id);
      else if (action === "reset") await api.adminResetUser(id);
      await load(tab);
    } finally {
      setBusyId(null);
    }
  };

  const total = useMemo(
    () => (counts.pending || 0) + (counts.approved || 0) + (counts.rejected || 0),
    [counts]
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Registered Users</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            {total} total &middot; {counts.pending || 0} awaiting approval
          </p>
        </div>
        <div className="flex gap-1 rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-white p-1">
          {TABS.map((t) => (
            <button
              key={t.key || "all"}
              onClick={() => setTab(t.key)}
              className={`rounded-sm px-3 py-1.5 text-xs font-semibold transition ${
                tab === t.key
                  ? "bg-navy-800 text-white"
                  : "text-navy-600 hover:bg-navy-50"
              }`}
            >
              {t.label}
              {t.key && counts[t.key] != null ? (
                <span className="ml-1.5 opacity-70">{counts[t.key]}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-[color:var(--color-text-muted)]">Loading...</p>
      ) : users.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-[color:var(--color-border)] bg-white p-10 text-center text-sm text-[color:var(--color-text-muted)]">
          No {tab || ""} users to show.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-navy-50 text-navy-700">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Registered</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="p-4 font-medium text-navy-800">{u.fullName}</td>
                  <td className="p-4 text-[color:var(--color-text-muted)]">
                    <div>{u.email}</div>
                    <div>{u.phone || "—"}</div>
                  </td>
                  <td className="p-4 text-[color:var(--color-text-muted)]">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {u.status !== "approved" && (
                        <button
                          disabled={busyId === u.id}
                          onClick={() => act(u.id, "approve")}
                          className="rounded-sm bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {u.status !== "rejected" && (
                        <button
                          disabled={busyId === u.id}
                          onClick={() => act(u.id, "reject")}
                          className="rounded-sm bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                      {u.status !== "pending" && (
                        <button
                          disabled={busyId === u.id}
                          onClick={() => act(u.id, "reset")}
                          className="rounded-sm border border-[color:var(--color-border)] px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50 disabled:opacity-50"
                        >
                          Reset
                        </button>
                      )}
                    </div>
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

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] || ""}`}>
      {status}
    </span>
  );
}
