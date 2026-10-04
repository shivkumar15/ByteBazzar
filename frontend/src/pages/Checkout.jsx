import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";
import CheckoutSteps from "../components/CheckoutSteps";
import ProductImage from "../components/ProductImage";
import { EmptyState, Spinner } from "../components/States";
import { formatPrice } from "../lib/format";
import { getUserId, notifyCartChanged } from "../lib/session";
import { useToast } from "../lib/useToast";

export default function Checkout() {
  const navigate = useNavigate();
  const userId = getUserId();
  const { push } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [items, setItems] = useState(null);
  const [failed, setFailed] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!userId) return;
    Promise.all([api.get(`/cart/${userId}`), api.get(`/address/${userId}`)])
      .then(([cartRes, addrRes]) => {
        setItems((cartRes.data?.items || []).filter((i) => i.productId));
        setAddresses(addrRes.data);
        setSelectedId(addrRes.data[addrRes.data.length - 1]?._id ?? null); // newest first choice
      })
      .catch(() => setFailed(true));
  }, [userId]);

  if (!userId)
    return (
      <div className="page">
        <EmptyState title="Log in to check out" actionLabel="Log in" to="/login" />
      </div>
    );
  if (failed)
    return (
      <div className="page">
        <EmptyState
          title="Can't load checkout"
          text="Check that the backend is running on port 5001, then try again."
          actionLabel="Try again"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  if (!items) return <Spinner label="Loading checkout" />;
  if (items.length === 0)
    return (
      <div className="page">
        <EmptyState
          title="Your cart is empty"
          text="Add something to your cart before checking out."
          actionLabel="Browse products"
          to="/"
        />
      </div>
    );

  const total = items.reduce((s, i) => s + i.productId.price * i.quantity, 0);
  const selected = addresses.find((a) => a._id === selectedId);

  const placeOrder = async () => {
    if (!selected) {
      push("Choose a delivery address first.", "error");
      return;
    }
    setPlacing(true);
    try {
      const res = await api.post("/order/place", { userId, address: selected });
      notifyCartChanged();
      navigate(`/order-success/${res.data.orderId}`);
    } catch (err) {
      push(err.response?.data?.message || "Couldn't place the order. Try again.", "error");
      setPlacing(false);
    }
  };

  return (
    <div className="page">
      <CheckoutSteps current={3} />
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight md:text-4xl">Review your order</h1>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <section aria-labelledby="addr-title">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="addr-title" className="text-xl font-bold">Delivery address</h2>
            <Link to="/checkout-address" className="text-sm font-semibold text-cobalt underline-offset-4 hover:underline">
              Add a new address
            </Link>
          </div>

          {addresses.length === 0 ? (
            <EmptyState
              title="No saved address"
              text="Add a delivery address to place your order."
              actionLabel="Add address"
              to="/checkout-address"
            />
          ) : (
            <div className="space-y-3" role="radiogroup" aria-labelledby="addr-title">
              {addresses.map((a) => {
                const active = a._id === selectedId;
                return (
                  <label
                    key={a._id}
                    className={`panel flex cursor-pointer items-start gap-4 p-5 transition-colors ${
                      active ? "!border-cobalt bg-cobalt-soft/50" : "hover:border-ink"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={active}
                      onChange={() => setSelectedId(a._id)}
                      className="mt-1.5 h-4 w-4 accent-cobalt"
                    />
                    <span className="text-sm leading-relaxed">
                      <span className="block text-base font-bold">{a.fullName}</span>
                      {[a.addressLine || a.adressLine, a.city, a.state].filter(Boolean).join(", ")}
                      {a.pincode && ` - ${a.pincode}`}
                      <span className="block text-muted">Phone {a.phone}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </section>

        <aside className="panel p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold">Order summary</h2>
          <ul className="mt-4 divide-y divide-line">
            {items.map(({ productId: p, quantity }) => (
              <li key={p._id} className="flex items-center gap-3 py-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-mist">
                  <ProductImage src={p.image} alt="" className="h-full w-full p-1.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold">{p.title}</p>
                  <p className="text-sm text-muted">Quantity {quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(p.price * quantity)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-2 flex items-baseline justify-between border-t border-line pt-4">
            <span className="font-bold">Total</span>
            <span className="font-display text-3xl font-bold">{formatPrice(total)}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={placing || !selected}
            className="btn btn-primary btn-large mt-6 w-full"
          >
            {placing ? "Placing order" : "Place order"}
          </button>
          <p className="mt-3 text-center text-sm text-muted">
            Payment: cash on delivery
          </p>
        </aside>
      </div>
    </div>
  );
}
