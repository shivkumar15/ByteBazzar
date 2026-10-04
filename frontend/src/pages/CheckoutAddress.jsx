import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";
import CheckoutSteps from "../components/CheckoutSteps";
import TextField from "../components/TextField";
import { EmptyState } from "../components/States";
import { getUserId } from "../lib/session";

export default function CheckoutAddress() {
  const userId = getUserId();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (!userId)
    return (
      <div className="page">
        <EmptyState title="Log in to check out" actionLabel="Log in" to="/login" />
      </div>
    );

  const saveAddress = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.post("/address/add", { ...form, userId });
      navigate("/checkout");
    } catch {
      setError("Couldn't save the address. Check your details and try again.");
      setBusy(false);
    }
  };

  return (
    <div className="page max-w-2xl">
      <CheckoutSteps current={2} />
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Delivery address</h1>
      <p className="mt-2 text-muted">Where should we deliver your order?</p>

      <form onSubmit={saveAddress} className="panel mt-6 grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
        {error && <div role="alert" className="alert-error sm:col-span-2">{error}</div>}
        <TextField className="sm:col-span-1" label="Full name" name="fullName" autoComplete="name" value={form.fullName} onChange={handleChange} required />
        <TextField className="sm:col-span-1" label="Phone number" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={handleChange} required />
        <TextField className="sm:col-span-2" label="Address" name="addressLine" autoComplete="street-address" placeholder="House number, street, area" value={form.addressLine} onChange={handleChange} required />
        <TextField label="City" name="city" autoComplete="address-level2" value={form.city} onChange={handleChange} required />
        <TextField label="State" name="state" autoComplete="address-level1" value={form.state} onChange={handleChange} required />
        <TextField label="Pincode" name="pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} pattern="[0-9]{6}" title="Enter a 6-digit pincode" value={form.pincode} onChange={handleChange} required />

        <div className="mt-2 flex flex-wrap items-center gap-4 sm:col-span-2">
          <button type="submit" disabled={busy} className="btn btn-primary btn-large">
            {busy ? "Saving" : "Save and continue"}
          </button>
          <Link to="/checkout" className="text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline">
            Use a saved address
          </Link>
        </div>
      </form>
    </div>
  );
}
