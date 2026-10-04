import { Link } from "react-router";

export function Spinner({ label = "Loading" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-muted" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-cobalt" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function EmptyState({ title, text, actionLabel, to, onAction }) {
  return (
    <div className="panel mx-auto max-w-lg px-6 py-14 text-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      {text && <p className="mx-auto mt-2 max-w-sm text-muted">{text}</p>}
      {actionLabel && to && (
        <Link to={to} className="btn btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary mt-6">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="panel p-3" aria-hidden="true">
      <div className="aspect-square animate-pulse rounded-2xl bg-mist" />
      <div className="mt-4 h-3 w-1/3 animate-pulse rounded bg-mist" />
      <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-mist" />
      <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-mist" />
    </div>
  );
}
