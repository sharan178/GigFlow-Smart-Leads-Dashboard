import { FormEvent, useEffect, useState } from "react";
import { Lead, LeadSource, LeadStatus } from "../types";

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
const sources: LeadSource[] = ["Website", "Instagram", "Referral"];

export type LeadFormInput = {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
};

export const LeadForm = ({
  lead,
  saving,
  onCancel,
  onSubmit,
}: {
  lead: Lead | null;
  saving: boolean;
  onCancel(): void;
  onSubmit(input: LeadFormInput): Promise<void>;
}) => {
  const [form, setForm] = useState<LeadFormInput>({
    name: "",
    email: "",
    status: "New",
    source: "Website",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (lead) setForm({ name: lead.name, email: lead.email, status: lead.status, source: lead.source });
    else setForm({ name: "", email: "", status: "New", source: "Website" });
    setError("");
  }, [lead]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.name.trim().length < 2) return setError("Name must be at least 2 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Enter a valid email address.");
    await onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{lead ? "Edit lead" : "Create lead"}</h2>
        <button type="button" onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">Close</button>
      </div>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{error}</p>}
      <input className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}>
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
        <select className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}>
          {sources.map((source) => <option key={source}>{source}</option>)}
        </select>
      </div>
      <button disabled={saving} className="rounded-md bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 disabled:opacity-60">
        {saving ? "Saving..." : "Save lead"}
      </button>
    </form>
  );
};
