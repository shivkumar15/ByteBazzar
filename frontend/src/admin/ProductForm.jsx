import { useState } from "react";
import { Link } from "react-router";
import TextField from "../components/TextField";
import ProductImage from "../components/ProductImage";
import { CATEGORIES } from "../lib/constants";

const EMPTY = { title: "", description: "", price: "", category: "", image: "", stock: "" };

export default function ProductForm({ initial, submitLabel, busyLabel, onSubmit, busy, error }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Keep an existing category selectable even if it isn't one of the defaults
  const categories =
    form.category && !CATEGORIES.includes(form.category)
      ? [...CATEGORIES, form.category]
      : CATEGORIES;

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="panel grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
      {error && <div role="alert" className="alert-error sm:col-span-2">{error}</div>}

      <TextField className="sm:col-span-2" label="Title" name="title" value={form.title} onChange={handleChange} required />
      <TextField className="sm:col-span-2" as="textarea" rows={4} label="Description" name="description" value={form.description} onChange={handleChange} />
      <TextField label="Price (₹)" name="price" type="number" min="0" step="0.01" inputMode="decimal" value={form.price} onChange={handleChange} required />
      <TextField label="Stock" name="stock" type="number" min="0" step="1" inputMode="numeric" value={form.stock ?? ""} onChange={handleChange} hint="How many units are available." />
      <TextField as="select" label="Category" name="category" value={form.category} onChange={handleChange}>
        <option value="">No category</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </TextField>
      <TextField label="Image link" name="image" type="url" placeholder="https://" value={form.image} onChange={handleChange} />

      <div className="sm:col-span-2">
        <p className="label">Image preview</p>
        <div className="h-36 w-36 overflow-hidden rounded-2xl bg-mist">
          <ProductImage src={form.image} alt="Product preview" className="h-full w-full p-3" />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={busy} className="btn btn-primary btn-large">
          {busy ? busyLabel : submitLabel}
        </button>
        <Link to="/admin/products" className="btn btn-quiet btn-large">Cancel</Link>
      </div>
    </form>
  );
}
