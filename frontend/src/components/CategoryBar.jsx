import { Link, useLocation, useSearchParams } from "react-router";
import { CATEGORIES } from "../lib/constants";

export default function CategoryBar() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const active = pathname === "/" ? params.get("category") || "" : null;

  return (
    <div className="border-t border-line">
      <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 md:px-6" aria-label="Categories">
        {["", ...CATEGORIES].map((c) => {
          const isActive = active === c;
          return (
            <li key={c || "all"} className="shrink-0">
              <Link
                to={c ? `/?category=${encodeURIComponent(c)}` : "/"}
                aria-current={isActive ? "page" : undefined}
                className={`block border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-cobalt text-cobalt"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {c || "All products"}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
