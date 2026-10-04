import { Link, useParams } from "react-router";
import { CheckIcon } from "../components/Icons";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="page">
      <div className="panel mx-auto max-w-lg px-6 py-14 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ok text-white">
          <CheckIcon width={32} height={32} strokeWidth={2.4} />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Order placed</h1>
        <p className="mt-2 text-muted">Pay in cash when your order arrives.</p>

        <div className="mt-8 rounded-2xl bg-mist px-4 py-4">
          <p className="text-sm text-muted">Order ID</p>
          <p className="mt-1 break-all font-mono text-sm font-semibold">{id}</p>
        </div>

        <Link to="/" className="btn btn-primary btn-large mt-8">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
