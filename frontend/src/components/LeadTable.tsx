import { Lead } from "../types";

export const LeadTable = ({
  leads,
  role,
  onEdit,
  onDelete,
}: {
  leads: Lead[];
  role: string;
  onEdit(lead: Lead): void;
  onDelete(id: string): void;
}) => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950">
          <tr>
            <th className="px-4 py-3">Lead</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900 dark:text-white">{lead.name}</p>
                <p className="text-slate-500">{lead.email}</p>
              </td>
              <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">{lead.status}</span></td>
              <td className="px-4 py-3">{lead.source}</td>
              <td className="px-4 py-3">{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td className="space-x-2 px-4 py-3 text-right">
                <button onClick={() => onEdit(lead)} className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">Edit</button>
                {role === "admin" && <button onClick={() => onDelete(lead._id)} className="rounded-md border border-red-300 px-3 py-1 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950">Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
