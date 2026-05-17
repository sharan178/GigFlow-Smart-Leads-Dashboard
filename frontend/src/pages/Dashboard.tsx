import { useEffect, useMemo, useState } from "react";
import { LeadForm, LeadFormInput } from "../components/LeadForm";
import { LeadTable } from "../components/LeadTable";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { getErrorMessage, leadApi } from "../services/api";
import { Lead, LeadFilters, PaginationMeta } from "../types";

const initialFilters: LeadFilters = { status: "", source: "", search: "", sort: "latest", page: 1 };

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);
  const debouncedSearch = useDebounce(filters.search);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [selected, setSelected] = useState<Lead | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);

  const requestFilters = useMemo(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await leadApi.list(requestFilters);
        setLeads(data.data);
        setMeta(data.meta);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [requestFilters]);

  const saveLead = async (input: LeadFormInput) => {
    setSaving(true);
    try {
      if (selected) await leadApi.update(selected._id, input);
      else await leadApi.create(input);
      setFormOpen(false);
      setSelected(null);
      const data = await leadApi.list(requestFilters);
      setLeads(data.data);
      setMeta(data.meta);
    } finally {
      setSaving(false);
    }
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm("Delete this lead?")) return;
    await leadApi.remove(id);
    setLeads((current) => current.filter((lead) => lead._id !== id));
  };

  const exportCsv = () => {
    const header = ["Name", "Email", "Status", "Source", "Created At"];
    const rows = leads.map((lead) => [lead.name, lead.email, lead.status, lead.source, new Date(lead.createdAt).toISOString()]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">GigFlow - Smart Leads Dashboard</h1>
            <p className="text-sm text-slate-500">{user?.name} - {user?.role === "admin" ? "Admin" : "Sales User"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setDark((value) => !value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">{dark ? "Light" : "Dark"}</button>
            <button onClick={exportCsv} className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">Export CSV</button>
            <button onClick={logout} className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">Logout</button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6">
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-5">
          <input className="rounded-md border border-slate-300 bg-transparent px-3 py-2 md:col-span-2 dark:border-slate-700" placeholder="Search name or email" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
          <select className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as LeadFilters["status"], page: 1 })}>
            <option value="">All statuses</option><option>New</option><option>Contacted</option><option>Qualified</option><option>Lost</option>
          </select>
          <select className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value as LeadFilters["source"], page: 1 })}>
            <option value="">All sources</option><option>Website</option><option>Instagram</option><option>Referral</option>
          </select>
          <select className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value as LeadFilters["sort"], page: 1 })}>
            <option value="latest">Latest</option><option value="oldest">Oldest</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">{meta.total} leads found</p>
          <button onClick={() => { setSelected(null); setFormOpen(true); }} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">New Lead</button>
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{error}</p>}
        {formOpen && <LeadForm lead={selected} saving={saving} onCancel={() => setFormOpen(false)} onSubmit={saveLead} />}
        {loading ? <p className="rounded-lg bg-white p-6 text-center shadow-sm dark:bg-slate-900">Loading leads...</p> : leads.length === 0 ? <p className="rounded-lg bg-white p-6 text-center text-slate-500 shadow-sm dark:bg-slate-900">No leads match the current filters.</p> : <LeadTable leads={leads} role={user?.role || "sales"} onEdit={(lead) => { setSelected(lead); setFormOpen(true); }} onDelete={deleteLead} />}

        <div className="flex items-center justify-end gap-2">
          <button disabled={meta.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })} className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-slate-700">Previous</button>
          <span className="text-sm text-slate-500">Page {meta.page} of {meta.totalPages}</span>
          <button disabled={meta.page >= meta.totalPages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })} className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-slate-700">Next</button>
        </div>
      </section>
    </main>
  );
};
