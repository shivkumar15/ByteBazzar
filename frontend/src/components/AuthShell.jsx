import { Link } from "react-router";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="page">
      <div className="panel grid overflow-hidden md:grid-cols-[1fr_1.1fr]">
        <div className="hidden flex-col justify-between bg-cobalt p-10 text-white md:flex">
          <Link to="/" className="font-display text-2xl font-extrabold tracking-tight">
            ByteBazaar
          </Link>
          <p className="font-display text-4xl font-extrabold leading-tight tracking-tight">
            Gadgets you can pay for when they arrive.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-sm text-muted">{footer}</p>
        </div>
      </div>
    </div>
  );
}
