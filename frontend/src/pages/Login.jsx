import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import api from "../api/axios";
import AuthShell from "../components/AuthShell";
import TextField from "../components/TextField";
import { saveSession } from "../lib/session";
import { useToast } from "../lib/useToast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { push } = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await api.post("/auth/login", form);
      saveSession(res.data);
      push("You're logged in", "success");
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Can't reach the server. Check that the backend is running.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Log in"
      subtitle="Use your account to keep a cart and place orders."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div role="alert" className="alert-error">{error}</div>}
        <TextField label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />
        <TextField label="Password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} required />
        <button type="submit" disabled={busy} className="btn btn-primary btn-large w-full">
          {busy ? "Logging in" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
