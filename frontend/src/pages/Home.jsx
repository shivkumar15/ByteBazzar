import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { ProductSkeleton, EmptyState } from "../components/States";
import { CATEGORIES } from "../lib/constants";
import { useAddToCart } from "../lib/useAddToCart";
import { useToast } from "../lib/useToast";

const SORTS = {
  new: { label: "Newest", fn: null },
  low: { label: "Price: low to high", fn: (a, b) => a.price - b.price },
  high: { label: "Price: high to low", fn: (a, b) => b.price - a.price },
};

function Grid({ products, onAdd, busyId }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} onAdd={onAdd} busy={busyId === p._id} />
      ))}
    </div>
  );
}

export default function Home() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") || "";
  const category = params.get("category") || "";
  const sort = SORTS[params.get("sort")] ? params.get("sort") : "new";

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState("");
  const { add, busyId } = useAddToCart();
  const { push } = useToast();

  useEffect(() => {
    let cancelled = false;
    api
      .get("/products", { params: { search, category } })
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [search, category, reloadKey]);

  const loadSamples = async () => {
    setSeeding(true);
    setSeedError("");
    try {
      const res = await api.post("/products/seed");
      push(res.data.message, "success");
      setReloadKey((k) => k + 1);
    } catch (err) {
      setSeedError(err.response?.data?.message || "Can't reach the server. Check that the backend is running.");
    } finally {
      setSeeding(false);
    }
  };

  const setSort = (value) => {
    const next = new URLSearchParams(params);
    if (value === "new") next.delete("sort");
    else next.set("sort", value);
    setParams(next, { replace: true });
  };

  const filtered = Boolean(search || category);

  // ---------- states ----------
  if (status === "loading")
    return (
      <div className="page">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );

  if (status === "error")
    return (
      <div className="page">
        <EmptyState
          title="Can't load products"
          text="The store couldn't reach the server. Check that the backend is running on port 5001, then try again."
          actionLabel="Try again"
          onAction={() => window.location.reload()}
        />
      </div>
    );

  // Store has no products at all
  if (products.length === 0 && !filtered)
    return (
      <div className="page">
        <div className="panel mx-auto max-w-xl px-6 py-14 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Your store is empty</h1>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Load a set of sample laptops, mobiles, tablets and accessories with photos and prices,
            or add your own products.
          </p>
          {seedError && (
            <div role="alert" className="alert-error mx-auto mt-5 max-w-md">
              {seedError}
            </div>
          )}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button onClick={loadSamples} disabled={seeding} className="btn btn-primary btn-large">
              {seeding ? "Loading products" : "Load sample products"}
            </button>
            <Link to="/admin/products/add" className="btn btn-quiet btn-large">
              Add my own
            </Link>
          </div>
        </div>
      </div>
    );

  // ---------- filtered / search view ----------
  if (filtered) {
    const sorted = SORTS[sort].fn ? [...products].sort(SORTS[sort].fn) : products;
    return (
      <div className="page">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              {search ? `Results for "${search}"` : category}
            </h1>
            <p className="mt-1 text-sm text-muted" aria-live="polite">
              {products.length} {products.length === 1 ? "product" : "products"}
              {search && category ? ` in ${category}` : ""}
            </p>
          </div>
          {products.length > 1 && (
            <div>
              <label htmlFor="sort" className="sr-only">Sort by</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input !w-auto !rounded-full !py-2 pr-8 text-sm font-medium"
              >
                {Object.entries(SORTS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No products match"
            text="Try a different search or browse another category."
            actionLabel="See all products"
            to="/"
          />
        ) : (
          <Grid products={sorted} onAdd={add} busyId={busyId} />
        )}
      </div>
    );
  }

  // ---------- default shop view: products grouped by category ----------
  const groups = new Map();
  for (const p of products) {
    const key = p.category || "More products";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }
  const order = [
    ...CATEGORIES.filter((c) => groups.has(c)),
    ...[...groups.keys()].filter((k) => !CATEGORIES.includes(k)),
  ];

  return (
    <div className="page">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-cobalt px-6 py-6 text-white md:px-10 md:py-7">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            Gadgets you can pay for when they arrive
          </h1>
          <p className="mt-1 text-white/85">Cash on delivery on every order.</p>
        </div>
        <Link to="/?category=Laptops" className="btn btn-large bg-white text-cobalt hover:bg-cobalt-soft">
          Shop laptops
        </Link>
      </section>

      <div className="mt-10 space-y-12">
        {order.map((name) => {
          const list = groups.get(name);
          const isCategory = CATEGORIES.includes(name);
          return (
            <section key={name} aria-labelledby={`cat-${name}`}>
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 id={`cat-${name}`} className="text-2xl font-bold">{name}</h2>
                {isCategory && list.length > 4 && (
                  <Link
                    to={`/?category=${encodeURIComponent(name)}`}
                    className="text-sm font-semibold text-cobalt underline-offset-4 hover:underline"
                  >
                    See all {name} ({list.length})
                  </Link>
                )}
              </div>
              <Grid products={isCategory ? list.slice(0, 4) : list} onAdd={add} busyId={busyId} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
