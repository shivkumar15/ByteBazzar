import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";
import { BagIcon } from "./Icons";
import SearchBar from "./SearchBar";
import CategoryBar from "./CategoryBar";
import { clearSession, getUserId, getUserName } from "../lib/session";

export default function Navbar() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(getUserId());
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const sync = () => setUserId(getUserId());
    window.addEventListener("authChanged", sync);
    return () => window.removeEventListener("authChanged", sync);
  }, []);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      const request = userId
        ? api
            .get(`/cart/${userId}`)
            .then((res) =>
              (res.data?.items || []).reduce((sum, item) => sum + item.quantity, 0)
            )
            .catch(() => 0)
        : Promise.resolve(0);
      request.then((n) => active && setCartCount(n));
    };
    refresh();
    window.addEventListener("cartUpdated", refresh);
    return () => {
      active = false;
      window.removeEventListener("cartUpdated", refresh);
    };
  }, [userId]);

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  const firstName = getUserName().split(" ")[0];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 md:px-6">
        <Link to="/" className="order-1 mr-auto flex items-center gap-2.5 md:mr-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-cobalt text-white">
            <BagIcon width={20} height={20} />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">
            ByteBazaar
          </span>
        </Link>

        <SearchBar className="order-3 w-full md:order-2 md:mx-4 md:w-auto md:flex-1" />

        <div className="order-2 flex items-center gap-2 sm:gap-3 md:order-3">
          <Link
            to="/cart"
            className="btn btn-quiet relative !px-3.5"
            aria-label={`Cart, ${cartCount} items`}
          >
            <BagIcon width={18} height={18} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-signal px-1 text-xs font-bold text-ink">
                {cartCount}
              </span>
            )}
          </Link>

          {userId ? (
            <>
              {firstName && (
                <span className="hidden text-sm text-muted md:inline">
                  Hi, {firstName}
                </span>
              )}
              <button onClick={logout} className="btn btn-quiet">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-quiet">
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary hidden sm:inline-flex">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
      <CategoryBar />
    </header>
  );
}
