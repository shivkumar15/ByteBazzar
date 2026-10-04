import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";
import AuthShell from "../components/AuthShell";
import TextField from "../components/TextField";
import { useToast } from "../lib/useToast";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { push } = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.post("/auth/signup", form);
      push("Account created. Log in to continue.", "success");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Can't reach the server. Check that the backend is running.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes a few seconds."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div role="alert" className="alert-error">{error}</div>}
        <TextField label="Full name" name="name" autoComplete="name" value={form.name} onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />
        <TextField label="Password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} required />
        <button type="submit" disabled={busy} className="btn btn-primary btn-large w-full">
          {busy ? "Creating account" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
