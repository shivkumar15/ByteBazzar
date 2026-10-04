import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";
import ProductImage from "../components/ProductImage";
import QuantityStepper from "../components/QuantityStepper";
import CheckoutSteps from "../components/CheckoutSteps";
import { EmptyState, Spinner } from "../components/States";
import { formatPrice } from "../lib/format";
import { getUserId, notifyCartChanged } from "../lib/session";
import { useToast } from "../lib/useToast";

export default function Cart() {
  const userId = getUserId();
  const navigate = useNavigate();
  const { push } = useToast();
  const [items, setItems] = useState(null);
  const [failed, setFailed] = useState(false);

  const fetchItems = useCallback(
    () =>
      api
        .get(`/cart/${userId}`)
        // A new user has no cart yet (null). Skip lines whose product was deleted.
        .then((res) => (res.data?.items || []).filter((i) => i.productId)),
    [userId]
  );

  useEffect(() => {
    if (!userId) return;
    let active = true;
    fetchItems()
      .then((list) => {
        if (!active) return;
        setItems(list);
        setFailed(false);
      })
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [userId, fetchItems]);

  const load = () =>
    fetchItems()
      .then((list) => {
        setItems(list);
        setFailed(false);
      })
      .catch(() => setFailed(true));

  const change = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await api.post("/cart/remove", { userId, productId });
      } else {
        await api.post("/cart/update", { userId, productId, quantity });
      }
      notifyCartChanged();
      await load();
    } catch {
      push("Couldn't update your cart. Try again.", "error");
    }
  };

  if (!userId)
    return (
      <div className="page">
        <EmptyState
          title="Log in to see your cart"
          text="Your cart is saved to your account."
          actionLabel="Log in"
          to="/login"
        />
      </div>
    );
  if (failed)
    return (
      <div className="page">
        <EmptyState
          title="Can't load your cart"
          text="Check that the backend is running on port 5001, then try again."
          actionLabel="Try again"
          onAction={load}
        />
      </div>
    );
  if (!items) return <Spinner label="Loading your cart" />;

  if (items.length === 0)
    return (
      <div className="page">
        <EmptyState
          title="Your cart is empty"
          text="Add a laptop, mobile or tablet and it will show up here."
          actionLabel="Browse products"
          to="/"
        />
      </div>
    );

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.productId.price * i.quantity, 0);

  return (
    <div className="page">
      <CheckoutSteps current={1} />
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight md:text-4xl">Your cart</h1>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="panel divide-y divide-line">
          {items.map(({ productId: p, quantity }) => (
            <li key={p._id} className="grid grid-cols-[88px_1fr] gap-4 p-4 sm:grid-cols-[88px_1fr_auto] sm:items-center">
              <Link to={`/product/${p._id}`} className="block aspect-square overflow-hidden rounded-2xl bg-mist">
                <ProductImage src={p.image} alt={p.title} className="h-full w-full p-2" />
              </Link>

              <div className="min-w-0">
                <Link to={`/product/${p._id}`} className="line-clamp-2 font-bold hover:underline">
                  {p.title}
                </Link>
                <p className="mt-0.5 text-sm text-muted">{formatPrice(p.price)} each</p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <QuantityStepper
                    value={quantity}
                    max={typeof p.stock === "number" ? p.stock : undefined}
                    onChange={(q) => change(p._id, q)}
                  />
                  <button onClick={() => change(p._id, 0)} className="btn-text-danger">
                    Remove
                  </button>
                </div>
              </div>

              <p className="col-span-2 text-right font-display text-xl font-bold sm:col-span-1">
                {formatPrice(p.price * quantity)}
              </p>
            </li>
          ))}
        </ul>

        <aside className="panel p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold">Order summary</h2>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Items</dt>
              <dd className="font-medium">{count}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-4">
              <dt className="font-bold">Total</dt>
              <dd className="font-display text-3xl font-bold">{formatPrice(total)}</dd>
            </div>
          </dl>
          <button
            onClick={() => navigate("/checkout-address")}
            className="btn btn-primary btn-large mt-6 w-full"
          >
            Continue to address
          </button>
          <p className="mt-3 text-center text-sm text-muted">
            You pay in cash when the order arrives.
          </p>
        </aside>
      </div>
    </div>
  );
}
