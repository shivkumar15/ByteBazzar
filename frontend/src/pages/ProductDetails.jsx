import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../api/axios";
import ProductImage from "../components/ProductImage";
import { EmptyState, Spinner } from "../components/States";
import { CheckIcon } from "../components/Icons";
import { formatPrice, isLowStock, isOutOfStock } from "../lib/format";
import { useAddToCart } from "../lib/useAddToCart";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(undefined); // undefined = loading, null = missing
  const [failed, setFailed] = useState(false);
  const [added, setAdded] = useState(false);
  const { add, busyId } = useAddToCart();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProduct(res.data.find((p) => p._id === id) || null))
      .catch(() => setFailed(true));
  }, [id]);

  if (failed)
    return (
      <div className="page">
        <EmptyState
          title="Can't load this product"
          text="Check that the backend is running on port 5001, then try again."
          actionLabel="Back to shop"
          to="/"
        />
      </div>
    );
  if (product === undefined) return <Spinner label="Loading product" />;
  if (product === null)
    return (
      <div className="page">
        <EmptyState
          title="Product not found"
          text="It may have been removed."
          actionLabel="Back to shop"
          to="/"
        />
      </div>
    );

  const out = isOutOfStock(product);
  const low = isLowStock(product);

  const handleAdd = async () => {
    if (await add(product)) setAdded(true);
  };

  return (
    <div className="page">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <Link to="/" className="hover:text-ink hover:underline">Shop</Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <span>{product.category}</span>
          </>
        )}
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="panel grid aspect-square place-items-center p-8">
          <ProductImage
            src={product.image}
            alt={product.title}
            className="h-full w-full"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {product.title}
          </h1>
          <p className="mt-5 font-display text-4xl font-bold">
            {formatPrice(product.price)}
          </p>

          <p
            className={`mt-3 text-sm font-semibold ${
              out ? "text-danger" : low ? "text-ink" : "text-ok"
            }`}
          >
            {out ? "Out of stock" : low ? `Only ${product.stock} left` : "In stock"}
          </p>

          {product.description && (
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
              {product.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={handleAdd}
              disabled={out || busyId === product._id}
              className="btn btn-primary btn-large"
            >
              {out ? "Out of stock" : "Add to cart"}
            </button>
            {added && (
              <Link to="/cart" className="btn btn-quiet btn-large">
                <CheckIcon width={18} height={18} className="text-ok" />
                View cart
              </Link>
            )}
          </div>
          <p className="mt-4 text-sm text-muted">Pay in cash when your order arrives.</p>
        </div>
      </div>
    </div>
  );
}
