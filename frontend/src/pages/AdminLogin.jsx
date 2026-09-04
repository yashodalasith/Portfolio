import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client.js";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.post("/admin/login", { pin });
      localStorage.setItem("admin_token", data.token);
      navigate("/admin/dashboard");
    } catch {
      setError("Incorrect PIN, or the backend isn't running in admin mode (ENABLE_ADMIN=true).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-white/10 bg-ink-raised p-8">
        <h1 className="font-display text-xl font-semibold text-bone">Admin access</h1>
        <p className="mt-2 text-sm text-slate">Enter your PIN to manage portfolio content.</p>

        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN"
          autoFocus
          className="mt-6 w-full rounded-md border border-white/10 bg-transparent px-4 py-2.5 text-bone focus:border-cyan"
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-amber py-2.5 text-sm font-medium text-ink disabled:opacity-50"
        >
          {loading ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}
