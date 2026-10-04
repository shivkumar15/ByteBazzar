import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import ProductImage from "../components/ProductImage";
import { EmptyState, Spinner } from "../components/States";
import { formatPrice } from "../lib/format";
import { useToast } from "../lib/useToast";

export default function ProductList() {
  const { push } = useToast();
  const [products, setProducts] = useState(null);
  const [failed, setFailed] = useState(false);

  const load = () =>
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => setFailed(true));

  useEffect(() => {
    load();
  }, []);

  const remove = async (product) => {
    if (!window.confirm(`Delete "${product.title}"? This can't be undone.`)) return;
    try {
      await api.delete(`/products/delete/${product._id}`);
      push("Product deleted", "success");
      load();
    } catch {
      push("Couldn't delete the product. Try again.", "error");
    }
  };

  if (failed)
    return (
      <div className="page">
        <EmptyState title="Can't load products" text="Check that the backend is running on port 5001." actionLabel="Try again" onAction={() => window.location.reload()} />
      </div>
    );
  if (!products) return <Spinner label="Loading products" />;

  return (
    <div className="page">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Products</h1>
          <p className="mt-1 text-muted">{products.length} in your store</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-primary btn-large">Add product</Link>
      </div>

      {products.length === 0 ? (
        <EmptyState title="No products yet" text="Add your first product and it will appear in the shop." actionLabel="Add product" to="/admin/products/add" />
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-medium">Product</th>
                <th scope="col" className="px-3 py-3.5 font-medium">Category</th>
                <th scope="col" className="px-3 py-3.5 text-right font-medium">Price</th>
                <th scope="col" className="px-3 py-3.5 text-right font-medium">Stock</th>
                <th scope="col" className="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-mist">
                        <ProductImage src={p.image} alt="" className="h-full w-full p-1" />
                      </div>
                      <Link to={`/product/${p._id}`} className="line-clamp-2 font-semibold hover:underline">
                        {p.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted">{p.category || "None"}</td>
                  <td className="px-3 py-3 text-right font-semibold">{formatPrice(p.price)}</td>
                  <td className="px-3 py-3 text-right">
                    <span className={typeof p.stock === "number" && p.stock <= 0 ? "font-semibold text-danger" : ""}>
                      {p.stock ?? "Not set"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link to={`/admin/products/edit/${p._id}`} className="text-sm font-semibold text-cobalt underline-offset-4 hover:underline">
                        Edit
                      </Link>
                      <button onClick={() => remove(p)} className="btn-text-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
