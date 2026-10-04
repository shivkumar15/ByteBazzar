import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";
import ProductForm from "./ProductForm";
import { useToast } from "../lib/useToast";

export default function AddProduct() {
  const navigate = useNavigate();
  const { push } = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (form) => {
    setBusy(true);
    setError("");
    try {
      await api.post("/products/add", form);
      push("Product added", "success");
      navigate("/admin/products");
    } catch {
      setError("Couldn't add the product. Check the details and try again.");
      setBusy(false);
    }
  };

  return (
    <div className="page max-w-3xl">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight md:text-4xl">Add product</h1>
      <ProductForm submitLabel="Add product" busyLabel="Adding" onSubmit={handleSubmit} busy={busy} error={error} />
    </div>
  );
}
