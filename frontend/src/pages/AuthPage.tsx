import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export const AuthPage = ({ mode }: { mode: "login" | "register" }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "sales" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") await auth.login(form.email, form.password);
      else await auth.register(form);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">GigFlow</h1>
        <p className="mt-1 text-sm text-slate-500">{mode === "login" ? "Sign in to your dashboard" : "Create your dashboard account"}</p>
        {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{error}</p>}
        <div className="mt-5 grid gap-3">
          {mode === "register" && <input required minLength={2} className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
          <input required type="email" className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required minLength={6} type="password" className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {mode === "register" && (
            <select className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="sales">Sales User</option>
              <option value="admin">Admin</option>
            </select>
          )}
        </div>
        <button disabled={loading} className="mt-5 w-full rounded-md bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 disabled:opacity-60">{loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}</button>
        <p className="mt-4 text-center text-sm text-slate-500">
          {mode === "login" ? "No account? " : "Already registered? "}
          <Link className="font-medium text-teal-700 dark:text-teal-300" to={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Register" : "Login"}</Link>
        </p>
      </form>
    </main>
  );
};
