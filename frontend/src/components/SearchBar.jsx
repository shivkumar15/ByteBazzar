import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { SearchIcon } from "./Icons";

export default function SearchBar({ className = "" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();

  // Show the active search on the shop page; keep the box in step when the URL changes
  const q = pathname === "/" ? params.get("q") || "" : "";
  const [value, setValue] = useState(q);
  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    setValue(q);
  }

  const submit = (e) => {
    e.preventDefault();
    const v = value.trim();
    navigate(v ? `/?q=${encodeURIComponent(v)}` : "/");
  };

  return (
    <form role="search" onSubmit={submit} className={`relative ${className}`}>
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
      <input
        id="site-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search laptops, phones, tablets"
        className="w-full rounded-full border border-transparent bg-mist py-2.5 pl-11 pr-24 text-base placeholder:text-muted focus:border-cobalt focus:bg-white"
      />
      <button type="submit" className="btn btn-primary absolute right-1 top-1/2 -translate-y-1/2 !px-4 !py-1.5">
        Search
      </button>
    </form>
  );
}
