import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../api/axios";
import ProductForm from "./ProductForm";
import { EmptyState, Spinner } from "../components/States";
import { useToast } from "../lib/useToast";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const [product, setProduct] = useState(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProduct(res.data.find((p) => p._id === id) || null))
      .catch(() => setProduct(null));
  }, [id]);

  const handleSubmit = async (form) => {
    setBusy(true);
    setError("");
    try {
      await api.put(`/products/update/${id}`, form);
      push("Changes saved", "success");
      navigate("/admin/products");
    } catch {
      setError("Couldn't save your changes. Try again.");
      setBusy(false);
    }
  };

  if (product === undefined) return <Spinner label="Loading product" />;
  if (product === null)
    return (
      <div className="page">
        <EmptyState title="Product not found" actionLabel="Back to products" to="/admin/products" />
      </div>
    );

  return (
    <div className="page max-w-3xl">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight md:text-4xl">Edit product</h1>
      <ProductForm initial={product} submitLabel="Save changes" busyLabel="Saving" onSubmit={handleSubmit} busy={busy} error={error} />
    </div>
  );
}
